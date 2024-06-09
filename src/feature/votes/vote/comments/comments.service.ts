import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateCommentRequestDto } from "./dto/CreateCommentsRequest.dto";
import { SurveyComment } from "@/global/model/db/survey-social";
import {
  CommentsDto,
  GetCommentsResponseDto,
} from "./dto/GetCommentsResponse.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly db: DataSource) {}

  public async getComments(voteId: number): Promise<GetCommentsResponseDto> {
    const query = this.db.createQueryRunner();
    try {
      await query.connect();
      const comments: SurveyComment[] = await query.manager.find(
        SurveyComment,
        {
          where: { surveyId: voteId },
          relations: ["user"],
        }
      );

      const commentsDto: CommentsDto[] = comments.map((comment) => ({
        username: comment.user.name,
        contents: comment.content,
        createdAt: comment.createdAt,
      }));

      return { comments: commentsDto };
    } catch (e) {
      throw new Error(`Error in getComments method: ${e.message}`);
    } finally {
      await query.release();
    }
  }

  public async createComment(
    voteId: number,
    createCommentRequestDto: CreateCommentRequestDto
  ): Promise<void> {
    const query = this.db.createQueryRunner();
    const { authorId, content } = createCommentRequestDto;
    try {
      await query.connect();
      const newComment: SurveyComment = query.manager.create(SurveyComment, {
        surveyId: voteId,
        authorId,
        content,
        isDeleted: false,
      });
      await query.manager.save(newComment);
    } catch (e) {
      throw new Error(`Error in createComment method: ${e.message}`);
    } finally {
      await query.release();
    }
  }

  public async deleteComment(
    voteId: number,
    commentId: number
  ): Promise<boolean> {
    const query = this.db.createQueryRunner();
    try {
      await query.connect();
      const result = await query.manager.delete(SurveyComment, {
        surveyId: voteId,
        id: commentId,
      });
      return result.affected ? true : false;
    } catch (e) {
      throw new Error(`Error in deleteComment method: ${e.message}`);
    } finally {
      query.release();
    }
  }
}
