import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Survey } from "@/global/model/db/survey";
import { DatabaseError } from "@/global/error/DatabaseError";
import Nullable from "@/global/type/nullable";
import { GetVotesResponseDto, VoteDto } from "@/feature/votes/dto/GetVotesResponse.dto";
import { pick } from "@/global/type/pick";
import { plainToInstance } from "class-transformer";

@Injectable()
export class VotesService {
    constructor(private readonly db: DataSource) {}
    public async getVotes(page: number = 1): Promise<GetVotesResponseDto> {
        const query = this.db.createQueryRunner();

        let surveys: Nullable<Survey[]> = null;
        try {
            await query.connect();
            surveys = await query.manager.find(Survey, {
                skip: (page - 1) * 50,
                take: 50,
                relations: {
                    hashtags: true,
                    user: true
                }
            });
            console.log(surveys);

        } catch (e) {
            Logger.error(e);
        } finally {
            await query.release();
        }

        if (!surveys) {
            throw new DatabaseError("Failed to fetch votes.");
        }

        const response = new GetVotesResponseDto();
        response.votes = surveys.map((s) => {
            const cls = plainToInstance(VoteDto, pick(s, [ "id", "title", "createdAt", "lastModifiedAt" ]));
            cls.author = pick(s.user, [ "id", "name" ]);
            cls.hashtags = s.hashtags.map((h) => pick(h.hashtag, [ "id", "name" ]));
            return cls;
        });
        return response;
    }
}
