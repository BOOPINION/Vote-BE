import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Survey, SurveyOption } from "@/global/model/db/survey";
import { GetVoteResponseDto } from "@/feature/votes/dto/GetVoteResponse.dto";
import { pick } from "@/global/type/pick";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { SurveyComment, SurveyLike } from "@/global/model/db/survey-social";
import { doAsyncFp, type Result } from "@/global/type/result";
import { ZeroResultError } from "@/global/error/ZeroResultError";
import { releaseWithError } from "@/global/error/release";
import { DatabaseError } from "@/global/error/DatabaseError";
import { CreateVoteRequestDto } from "@/feature/votes/dto/CreateVoteRequest.dto";
import { Hashtag, SurveyHashtag } from "@/global/model/db/hashtag";
import { CreateVoteResponseDto } from "@/feature/votes/dto/CreateVoteResponse.dto";

@Injectable()
export class VoteService {
    constructor(private readonly db: DataSource) {}

    public async getVote(voteId: number): Promise<Result<GetVoteResponseDto>> {
        const query = this.db.createQueryRunner();

        // connect db
        const connect = await doAsyncFp(query.connect.bind(query));

        // when failed to connect db
        if (!connect.success) return releaseWithError(query, new DatabaseError(connect.error.message));

        // fetch survey by id
        const survey = await doAsyncFp(() => query.manager.findOne(Survey, {
            where: {
                id: voteId
            },
            relations: {
                user: true,
                hashtags: true,
                options: true
            }
        }));
        if (!survey.success) return releaseWithError(query, new DatabaseError(survey.error.message));
        if (!survey.value) return releaseWithError(query, new ZeroResultError(`There is no vote for ${voteId}`));

        // fetch likes count
        const likes = await doAsyncFp(query.manager.count.bind(query.manager), SurveyLike, {
            where: {
                surveyId: voteId
            }
        });
        if (!likes.success) return releaseWithError(query, new DatabaseError(likes.error.message));

        // fetch comments count
        const comments = await doAsyncFp(query.manager.count.bind(query.manager), SurveyComment, {
            where: {
                surveyId: voteId,
                isDeleted: false
            }
        });
        if (!comments.success) return releaseWithError(query, new DatabaseError(comments.error.message));

        await query.release();

        const res = plainToInstance(GetVoteResponseDto, pick(survey.value, [ "id", "title", "content", "createdAt", "lastModifiedAt" ]));
        res.options = survey.value.options.filter((s) => !s.isDeleted).map((s) => pick(s, [ "id", "content" ]));
        res.hashtags = survey.value.hashtags.map((h) => h.hashtag).map((h) => pick(h, [ "id", "name" ]));
        res.likes = likes.value;
        res.comments = comments.value;
        res.author = pick(survey.value.user, [ "id", "name" ]);

        return { success: true, value: res };
    }

    public async createVote(vote: CreateVoteRequestDto): Promise<Result<CreateVoteResponseDto, DatabaseError>> {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.insert(
            Survey,
            pick(instanceToPlain(vote), [ "title", "content", "authorId" ])
        ));
        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));
        const id = result.value.raw.insertId satisfies number;

        // insert survey options
        const optionsResult = await doAsyncFp(() => runner.manager.insert(
            SurveyOption,
            vote.options.map((o) => ({
                surveyId: id,
                content: o
            }))
        ));
        if (!optionsResult.success) return releaseWithError(runner, new DatabaseError(optionsResult.error.message));

        // when hashtags exist in response, insert hashtags
        if (vote.hashtags && vote.hashtags.length > 0) {
            // create not exist hashtags
            const tagInsertResult = await this.createOnlyNewHashtags(vote.hashtags);
            if (!tagInsertResult.success) return releaseWithError(runner, tagInsertResult.error);

            // get exist hashtags for insert SurveyHashtags
            const hashtags = await this.getHashtags(vote.hashtags);
            if (!hashtags.success) return releaseWithError(runner, new DatabaseError(hashtags.error.message));

            const surveyHashtags = await doAsyncFp(() => runner.manager.insert(
                SurveyHashtag,
                hashtags.value.map((h) => ({ hashtagId: h.id, surveyId: id }))
            ));
            if (!surveyHashtags.success) {
                return releaseWithError(runner, new DatabaseError(surveyHashtags.error.message));
            }
        }

        await runner.release();

        const res = new CreateVoteResponseDto();
        res.voteId = id;

        return { success: true, value: res } as const;
    }

    public async deleteVote(voteId: number) {
        const runner = this.db.createQueryRunner();

        const connect = await (doAsyncFp(runner.connect.bind(runner)));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.update(
            Survey, { id: voteId }, { isDeleted: true }
        ));
        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));

        await runner.release();

        return { success: true, value: { success: true } } as const;

    }

    private async getHashtags(hashtags: string[]): Promise<Result<Hashtag[], DatabaseError | ZeroResultError>> {
        const runner = this.db.createQueryRunner();

        const connect = await doAsyncFp(runner.connect.bind(runner));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.find(Hashtag, {
            where: hashtags.map((h) => ({ name: h }))
        }));
        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));
        if (!result.value || result.value.length < 1) return releaseWithError(runner, new ZeroResultError("There is no hashtag"));

        await runner.release();

        return { success: true, value: result.value } as const;
    }

    private async createOnlyNewHashtags(hashtags: string[]): Promise<Result<undefined, DatabaseError>> {
        const existTagsResult = await this.getHashtags(hashtags);

        let targetHashtags: string[] = [];

        if (!existTagsResult.success) {
            if (existTagsResult.error instanceof ZeroResultError) {
                targetHashtags = hashtags;
            } else {
                return { success: false, error: existTagsResult.error } as const;
            }
        }

        // filtering only not exist hashtags
        if (existTagsResult.success) {
            targetHashtags = hashtags.filter((h) => existTagsResult.value.findIndex((e) => e.name == h) == -1);
        }

        const runner = this.db.createQueryRunner();

        const connect = await doAsyncFp(runner.connect.bind(runner));
        if (!connect.success) return releaseWithError(runner, new DatabaseError(connect.error.message));

        const result = await doAsyncFp(() => runner.manager.insert(
            Hashtag,
            targetHashtags.map((h) => ({ name: h }))
        ));
        if (!result.success) return releaseWithError(runner, new DatabaseError(result.error.message));

        return { success: true, value: undefined } as const;
    }
}
