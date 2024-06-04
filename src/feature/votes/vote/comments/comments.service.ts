import { SurveyComment } from "@/global/model/db/survey-social";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { GetCommentsResponseDto } from "./dto/GetCommentsResponse.dto";

@Injectable()
export class CommentsService {
    constructor(private readonly db: DataSource) {}

    public async getComments(voteId: number) {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
        } catch (e) {
            throw new Error(`Error in getComments method: ${e.message}`);
        } finally {
            await query.release();
        }
    }

    public async createComment() {}
}
