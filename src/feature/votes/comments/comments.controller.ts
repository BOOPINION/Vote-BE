import { Controller, Get, Param } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { GetCommentsResponseDto } from "../dto/GetCommentsResponse.dto";

@Controller("votes")
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get(":voteId/comments")
    public async getComments(@Param("voteId") voteId: number) {
        return this.commentsService.getComments(voteId);
    }
}
