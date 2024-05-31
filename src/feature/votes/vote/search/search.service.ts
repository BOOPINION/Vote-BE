import { Injectable } from "@nestjs/common";
import { DataSource, Like } from "typeorm";
import { doAsyncFp, Result } from "@/global/type/result";
import { releaseWithError } from "@/global/error/release";
import { DatabaseError } from "@/global/error/DatabaseError";
import { Hashtag, SurveyHashtag } from "@/global/model/db/hashtag";
import { Survey } from "@/global/model/db/survey";
import { plainToInstance } from "class-transformer";
import { SearchSurveyByHashtagResponseDto } from "@/feature/votes/vote/search/dto/SearchSurveyByHashtagResponse.dto";
import { SearchHashtagByNameResponseDto } from "@/feature/votes/vote/search/dto/SearchHashtagByNameResponse.dto";
import { pick } from "@/global/type/pick";

@Injectable()
export class SearchService {
    public constructor(private readonly db: DataSource) {}

    public async searchSurveysByHashtag(
        hashtagId: number, page: number = 1
    ): Promise<Result<SearchSurveyByHashtagResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const idsResult = await doAsyncFp(() => runner.manager.find(SurveyHashtag, {
            where: {
                hashtagId
            },
            take: 50,
            skip: 50 * (page - 1)
        }));
        if (!idsResult.success) return releaseWithError(runner, new DatabaseError(idsResult.error.message));

        const result = await doAsyncFp(() => runner.manager.find(Survey, {
            where: [
                ...idsResult.value.map((h) => ({ id: h.surveyId }))
            ],
            relations: [ "user", "hashtags" ]
        }));
        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));

        const votes = result.value.map((survey) => ({
            id: survey.id,
            content: survey.content,
            author: {
                id: survey.user.id,
                name: survey.user.name
            },
            hashtags: survey.hashtags.map((h) => ({
                id: h.hashtag.id,
                name: h.hashtag.name
            }))
        }));

        await runner.release();

        return { success: true, value: plainToInstance(SearchSurveyByHashtagResponseDto, { hashtagId, page, votes }) };
    }

    public async searchHashtagsByName(q: string): Promise<Result<SearchHashtagByNameResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.find(Hashtag, {
            where: {
                name: Like(`%${q}%`)
            },
            take: 50
        }));

        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));

        await runner.release();

        return { success: true, value: plainToInstance(SearchHashtagByNameResponseDto, {
            q, hashtags: result.value.map((h) => pick(h, [ "id", "name" ]))
        }) };
    }
}
