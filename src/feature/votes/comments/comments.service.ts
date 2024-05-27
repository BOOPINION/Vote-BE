import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class CommentsService {
    constructor(private readonly db: DataSource) {}

    public async getComments(voteId: number) {
        return voteId;
    }
}
