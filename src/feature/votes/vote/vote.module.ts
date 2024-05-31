import { Module } from "@nestjs/common";
import { VoteController } from "./vote.controller";
import { VoteService } from "./vote.service";
import { QuestionModule } from "@/feature/votes/vote/question/question.module";
import { UpdateModule } from "@/feature/votes/vote/update/update.module";
import { LikeModule } from "@/feature/votes/vote/like/like.module";
import { SearchModule } from "@/feature/votes/vote/search/search.module";

@Module({
    imports: [ QuestionModule, UpdateModule, LikeModule, SearchModule ],
    controllers: [ VoteController ],
    providers: [ VoteService ]
})
export class VoteModule {}
