import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Survey } from "@/global/model/db/survey";
import { GetVoteResponseDto } from "@/feature/votes/dto/GetVoteResponse.dto";
import { pick } from "@/global/type/pick";
import { plainToInstance } from "class-transformer";
import { SurveyComment, SurveyLike } from "@/global/model/db/survey-social";
import { doAsyncFp, type Result } from "@/global/type/result";
import { ZeroResultError } from "@/global/error/ZeroResultError";
import { releaseWithError } from "@/global/error/release";
import { DatabaseError } from "@/global/error/DatabaseError";

@Injectable()
export class VoteService {
    constructor(private readonly db: DataSource) {}

    public async getVote(voteId: number): Promise<Result<GetVoteResponseDto>> {
        const query = this.db.createQueryRunner();

        // connect db
        const connect = await doAsyncFp(query.connect.bind(query));

        // when failed to connect db
        if (!connect.success) return releaseWithError(query, new DatabaseError(connect.error.message));

        // fetch survey by id
        const survey = await doAsyncFp(() => query.manager.findOne(Survey, {
            where: {
                id: voteId
            },
            relations: {
                user: true,
                hashtags: true,
                options: true
            }
        }));
        if (!survey.success) return releaseWithError(query, new DatabaseError(survey.error.message));
        if (!survey.value) return releaseWithError(query, new ZeroResultError(`There is no vote for ${voteId}`));

        // fetch likes count
        const likes = await doAsyncFp(query.manager.count.bind(query.manager), SurveyLike, {
            where: {
                surveyId: voteId
            }
        });
        if (!likes.success) return releaseWithError(query, new DatabaseError(likes.error.message));

        // fetch comments count
        const comments = await doAsyncFp(query.manager.count.bind(query.manager), SurveyComment, {
            where: {
                surveyId: voteId,
                isDeleted: false
            }
        });
        if (!comments.success) return releaseWithError(query, new DatabaseError(comments.error.message));

        await query.release();

        const res = plainToInstance(GetVoteResponseDto, pick(survey.value, [ "id", "title", "content", "createdAt", "lastModifiedAt" ]));
        res.options = survey.value.options.filter((s) => !s.isDeleted).map((s) => pick(s, [ "id", "content" ]));
        res.hashtags = survey.value.hashtags.map((h) => h.hashtag).map((h) => pick(h, [ "id", "name" ]));
        res.likes = likes.value;
        res.comments = comments.value;

        return { success: true, value: res };
    }
}
