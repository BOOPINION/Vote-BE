import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { doAsyncFp, Result } from "@/global/type/result";
import { releaseWithError } from "@/global/error/release";
import { DatabaseError } from "@/global/error/DatabaseError";
import { SurveyLike } from "@/global/model/db/survey-social";
import { GetLikesResponseDto } from "@/feature/votes/vote/like/dto/GetLikesResponse.dto";
import { plainToInstance } from "class-transformer";
import { GetLikeResponseDto } from "@/feature/votes/vote/like/dto/GetLikeResponse.dto";
import { DoLikeResponseDto } from "@/feature/votes/vote/like/dto/DoLikeResponse.dto";

@Injectable()
export class LikeService {
    public constructor(private readonly db: DataSource) {}

    public async getLikes(voteId: number): Promise<Result<GetLikesResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const countResult = await doAsyncFp(() => runner.manager.count(SurveyLike, {
            where: { surveyId: voteId }
        }));

        if (!countResult.success) return releaseWithError(runner, new DatabaseError(countResult.error.message));

        await runner.release();

        return { success: true, value: plainToInstance(GetLikesResponseDto, { likes: countResult.value }) };
    }

    public async getLike(voteId: number, userId: number): Promise<Result<GetLikeResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.findOne(SurveyLike, {
            where: {
                surveyId: voteId,
                userId
            }
        }));

        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));

        await runner.release();

        if (result.value) {
            return { success: true, value: plainToInstance(GetLikeResponseDto, { isLiked: true }) };
        } else {
            return { success: true, value: plainToInstance(GetLikeResponseDto, { isLiked: false }) };
        }
    }

    public async doLike(voteId: number, userId: number): Promise<Result<DoLikeResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const likedResult = await doAsyncFp(() => runner.manager.findOne(SurveyLike, {
            where: {
                surveyId: voteId,
                userId
            }
        }));
        if (!likedResult.success) return releaseWithError(runner, new DatabaseError(likedResult.error.message));

        if (likedResult.value) {
            const deleteResult = await doAsyncFp(() => runner.manager.remove(SurveyLike, likedResult.value));
            if (!deleteResult.success) return releaseWithError(runner, new DatabaseError(deleteResult.error.message));
        } else {
            const insertResult = await doAsyncFp(() => runner.manager.insert(SurveyLike, {
                surveyId: voteId,
                userId
            }));
            if (!insertResult.success) return releaseWithError(runner, new DatabaseError(insertResult.error.message));
        }

        await runner.release();

        return { success: true, value: plainToInstance(DoLikeResponseDto, {
            success: true,
            resultLiked: !likedResult.value
        }) };
    }
}
