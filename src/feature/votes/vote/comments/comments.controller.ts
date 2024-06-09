import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Headers,
    Body
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentRequestDto } from "./dto/CreateCommentsRequest.dto";

@Controller("votes")
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get(":voteId/comments")
    public async getComments(@Param("voteId") voteId: number) {
        return await this.commentsService.getComments(voteId);
    }

    @Post(":voteId/comments")
    public async createComment(
        @Headers("Authorization") tokenHeader: string,
            @Param("voteId") voteId: number,
            @Body() createCommentRequestDto: CreateCommentRequestDto
    ): Promise<void> {
    // if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) throw new HttpException("Token not provided", HttpStatus.UNAUTHORIZED);
    //  const token = tokenHeader.replace("Bearer ", "");

        return await this.commentsService.createComment(
            voteId,
            createCommentRequestDto
        );
    }
}
