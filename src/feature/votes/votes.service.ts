import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Survey } from "@/global/model/db/survey";
import { DatabaseError } from "@/global/error/DatabaseError";
import { GetVotesResponseDto, VoteDto } from "@/feature/votes/dto/GetVotesResponse.dto";
import { pick } from "@/global/type/pick";
import { plainToInstance } from "class-transformer";
import { doAsyncFp, type Result } from "@/global/type/result";
import { releaseWithError } from "@/global/error/release";
import { ZeroResultError } from "@/global/error/ZeroResultError";

@Injectable()
export class VotesService {
    constructor(private readonly db: DataSource) {}
    public async getVotes(page: number = 1, size: number = 10): Promise<Result<GetVotesResponseDto>> {
        const query = this.db.createQueryRunner();

        const connect = await doAsyncFp(query.connect.bind(query));
        if (!connect.success) return releaseWithError(query, new DatabaseError(connect.error.message));

        const surveys = await doAsyncFp(() => query.manager.find(Survey, {
            skip: (page - 1) * size,
            take: size,
            relations: {
                hashtags: true,
                user: true
            },
            where: {
                isDeleted: false
            }
        }));
        if (!surveys.success) return releaseWithError(query, new DatabaseError(surveys.error.message));
        if (!surveys.value || surveys.value.length < 1) return releaseWithError(query, new ZeroResultError("Failed to fetch votes."));

        const response = new GetVotesResponseDto();
        response.votes = surveys.value.map((s) => {
            const cls = plainToInstance(VoteDto, pick(s, [ "id", "title", "content", "createdAt", "lastModifiedAt" ]));
            cls.author = pick(s.user, [ "id", "name" ]);
            cls.hashtags = s.hashtags.map((h) => pick(h.hashtag, [ "id", "name" ]));
            return cls;
        });
        return { success: true, value: response };
    }
}
