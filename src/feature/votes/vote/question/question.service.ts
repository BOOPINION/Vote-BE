import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { doAsyncFp } from "@/global/type/result";
import { releaseWithError } from "@/global/error/release";
import { DatabaseError } from "@/global/error/DatabaseError";
import { SurveyAnswer } from "@/global/model/db/survey";
import { plainToInstance } from "class-transformer";
import { SubmitQuestionResponseDto } from "@/feature/votes/vote/question/dto/SubmitQuestionResponse.dto";

@Injectable()
export class QuestionService {
    constructor(private readonly db: DataSource) {}

    public async submitQuestion(userId: number, voteId: number, questionId: number) {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.insert(SurveyAnswer, {
            surveyId: voteId,
            optionId: questionId,
            userId: userId
        }));
        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));

        return { success: true, value: plainToInstance(SubmitQuestionResponseDto, result.value) } as const;
    }
}
