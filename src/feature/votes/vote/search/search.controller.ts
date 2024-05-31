import { Controller, Get, HttpException, HttpStatus, Logger, Query } from "@nestjs/common";
import { SearchService } from "@/feature/votes/vote/search/search.service";

@Controller("votes/search")
export class SearchController {
    public constructor(private readonly searchService: SearchService) {}

    @Get("vote-by-hashtag")
    public async searchSurveysByHashtag(
    @Query("h") hashtagId: number,
        @Query("page") page?: number
    ) {
        const pageNum = page ? Number(page) : 1;
        const result = await this.searchService.searchSurveysByHashtag(
            Number(hashtagId), pageNum
        );

        if (!result.success) {
            const { error } = result;
            Logger.error(error);

            throw new HttpException("Database Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Get("hashtag-by-name")
    public async searchHashtagsByName(
    @Query("q") q: string
    ) {
        const result = await this.searchService.searchHashtagsByName(q);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);

            throw new HttpException("Database Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }
}
