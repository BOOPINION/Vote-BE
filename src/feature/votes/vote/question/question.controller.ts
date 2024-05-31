import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { QuestionService } from "@/feature/votes/vote/question/question.service";
import { SubmitQuestionRequestDto } from "@/feature/votes/vote/question/dto/SubmitQuestionRequest.dto";

@ApiTags("votes")
@Controller("votes/:voteId/question")
export class QuestionController {
    public constructor(private readonly questionService: QuestionService) {}

    @Post(":questionId")
    public async submitQuestion(
    @Param("voteId") voteId: number,
        @Param("questionId") questionId: number,
        @Body() params: SubmitQuestionRequestDto
    ) {
        const result = await this.questionService.submitQuestion(params.userId, voteId, questionId);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);

            throw new HttpException("Database Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }
}
