import { Module } from "@nestjs/common";
import { SearchController } from "@/feature/votes/vote/search/search.controller";
import { SearchService } from "@/feature/votes/vote/search/search.service";

@Module({
    imports: [],
    controllers: [ SearchController ],
    providers: [ SearchService ]
})
export class SearchModule {}
