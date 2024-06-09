import {
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Body,
  Delete,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentRequestDto } from "./dto/CreateCommentsRequest.dto";
import { GetCommentsResponseDto } from "./dto/GetCommentsResponse.dto";

@Controller("votes")
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(":voteId/comments")
  public async getComments(
    @Param("voteId") voteId: number
  ): Promise<GetCommentsResponseDto> {
    return await this.commentsService.getComments(voteId);
  }

  @Post(":voteId/comments")
  public async createComment(
    @Headers("Authorization") tokenHeader: string,
    @Param("voteId") voteId: number,
    @Body() createCommentRequestDto: CreateCommentRequestDto
  ): Promise<void> {
    return await this.commentsService.createComment(
      voteId,
      createCommentRequestDto
    );
  }

  @Delete(":voteId/comments/:commentId")
  public async deleteComment(
    @Headers("Authorization") tokenHeader: string,
    @Param("voteId") voteId: number,
    @Param("commentId") commentId: number
  ): Promise<boolean> {
    return await this.commentsService.deleteComment(voteId, commentId);
  }
}
