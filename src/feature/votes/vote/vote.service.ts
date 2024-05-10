import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Survey } from "@/global/model/db/survey";
import Nullable from "@/global/type/nullable";
import { DatabaseError } from "@/global/error/DatabaseError";
import { GetVoteResponseDto } from "@/feature/votes/dto/GetVoteResponse.dto";
import { pick } from "@/global/type/pick";
import { plainToInstance } from "class-transformer";
import { SurveyComment, SurveyLike } from "@/global/model/db/survey-social";

@Injectable()
export class VoteService {
    constructor(private readonly db: DataSource) {}

    public async getVote(voteId: number): Promise<GetVoteResponseDto> {
        const query = this.db.createQueryRunner();

        let survey: Nullable<Survey> = null;
        let likes: number = 0;
        let comments: number = 0;

        try {
            await query.connect();
            survey = await query.manager.findOne(Survey, {
                where: {
                    id: voteId
                },
                relations: {
                    user: true,
                    hashtags: true,
                    options: true
                }
            });

            likes = (await query.manager.count(SurveyLike, {
                where: {
                    surveyId: voteId
                }
            }));

            comments = (await query.manager.count(SurveyComment, {
                where: {
                    surveyId: voteId,
                    isDeleted: false
                }
            }));

        } catch (e) {
            Logger.error(e);
        } finally {
            await query.release();
        }

        if (!survey) {
            throw new DatabaseError("Invalid vote.");
        }

        const res = plainToInstance(GetVoteResponseDto, pick(survey, [ "id", "title", "content", "createdAt", "lastModifiedAt" ]));
        res.author = pick(survey.user, [ "id", "name" ]);
        res.options = survey.options.filter((s) => !s.isDeleted).map((s) => pick(s, [ "id", "content" ]));
        res.hashtags = survey.hashtags.map((h) => h.hashtag).map((h) => pick(h, [ "id", "name" ]));
        res.likes = likes;
        res.comments = comments;

        return res;
    }
}
