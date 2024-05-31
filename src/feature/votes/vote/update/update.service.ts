import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { doAsyncFp, Result } from "@/global/type/result";
import { releaseWithError } from "@/global/error/release";
import { DatabaseError } from "@/global/error/DatabaseError";
import { Survey, SurveyOption } from "@/global/model/db/survey";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { pick } from "@/global/type/pick";
import { GetValueForUpdateResponseDto } from "@/feature/votes/vote/update/dto/GetValueForUpdateResponse.dto";
import { UpdateVoteRequestDto } from "@/feature/votes/vote/update/dto/UpdateVoteRequest.dto";
import { UpdateVoteResponseDto } from "@/feature/votes/vote/update/dto/UpdateVoteResponse.dto";
import { Hashtag, SurveyHashtag } from "@/global/model/db/hashtag";

@Injectable()
export class UpdateService {
    constructor(private readonly db: DataSource) {}

    public async getValueForUpdate(surveyId: number): Promise<Result<GetValueForUpdateResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.findOne(Survey, {
            where: { id: surveyId },
            relations: {
                options: true,
                hashtags: true
            }
        }));

        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));
        if (!result.value) return releaseWithError(runner, new DatabaseError("Survey not found"));

        await runner.release();

        const hashtags = result?.value?.hashtags
            ?.map((h) => instanceToPlain(
                pick(h.hashtag, [ "id", "name" ])
            ) as { id: number, name: string });
        const options = result?.value?.options
            ?.map((o) => instanceToPlain(
                pick(o, [ "id", "content" ])
            ) as { id: number, content: string });

        const response = plainToInstance(GetValueForUpdateResponseDto, {
            id: result.value.id,
            title: result.value.title,
            content: result.value.content,
            hashtags, options
        });

        return { success: true, value: response };
    }

    public async updateVote(voteId: number, data: UpdateVoteRequestDto): Promise<Result<UpdateVoteResponseDto>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        await runner.startTransaction();

        const surveyResult = await doAsyncFp(() => runner.manager.update(Survey, {
            id: voteId
        }, {
            title: data.title,
            content: data.content
        }));
        if (!surveyResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(surveyResult.error.message));
        }

        const hashtagsResult = await this.updateHashtags(runner, voteId, data.hashtags);
        if (hashtagsResult) return hashtagsResult;

        const optionsResult = await this.updateOptions(runner, voteId, data.options);
        if (optionsResult) return optionsResult;

        await runner.commitTransaction();
        await runner.release();

        const res = plainToInstance(UpdateVoteResponseDto, {
            success: true
        });

        return { success: true, value: res };
    }

    private async updateHashtags(runner: QueryRunner, surveyId: number, hashtags: string[]) {
        const findHashtagsResult = await doAsyncFp(() => runner.manager.find(Hashtag, {
            where: [ ...hashtags.map((h) => ({ name: h })) ]
        }));
        if (!findHashtagsResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(findHashtagsResult.error.message));
        }
        const dbHashtagNames = findHashtagsResult.value.map((h) => h.name);
        const newHashtagNames = hashtags.filter((h) => !dbHashtagNames.includes(h));

        const newHashtags = newHashtagNames.map((h) => runner.manager.create(Hashtag, { name: h }));

        const newHashtagsResult = await doAsyncFp(() => runner.manager.save(newHashtags));
        if (!newHashtagsResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(newHashtagsResult.error.message));
        }

        const surveyHashtagsDeleteResult = await doAsyncFp(() => runner.manager.delete(SurveyHashtag, {
            surveyId
        }));
        if (!surveyHashtagsDeleteResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(surveyHashtagsDeleteResult.error.message));
        }

        const existHashtags = findHashtagsResult.value;
        existHashtags.push(...newHashtagsResult.value);
        const resultHashtags = existHashtags.map((h) => runner.manager.create(SurveyHashtag, {
            hashtagId: h.id,
            surveyId
        }));

        const hashtagInsertResult = await doAsyncFp(() => runner.manager.save(resultHashtags));
        if (!hashtagInsertResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(hashtagInsertResult.error.message));
        }
    }

    private async updateOptions(runner: QueryRunner, surveyId: number, options: { id?: number, content: string }[]) {
        const existOptions = options.filter((o) => o.id)
            .map((o) => runner.manager.create(SurveyOption, {
                id: o.id,
                content: o.content,
                surveyId
            }));
        const newOptions = options.filter((o) => !o.id)
            .map((o) => runner.manager.create(SurveyOption, {
                content: o.content,
                surveyId
            }));
        const resultOptions = existOptions.concat(newOptions);

        const optionUpdateResult = await doAsyncFp(() =>
            runner.manager.save(resultOptions));

        if (!optionUpdateResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(optionUpdateResult.error.message));
        }

        const findResult = await doAsyncFp(() => runner.manager.find(SurveyOption, {
            where: { surveyId }
        }));
        if (!findResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(findResult.error.message));
        }

        const deleteTargets = findResult.value.filter((o) => !resultOptions.map((r) => r.id).includes(o.id));
        const deleteResult = await doAsyncFp(() => runner.manager.remove(deleteTargets));
        if (!deleteResult.success) {
            await runner.rollbackTransaction();
            return releaseWithError(runner, new DatabaseError(deleteResult.error.message));
        }
    }
}
