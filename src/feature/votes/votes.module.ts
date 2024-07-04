import { Module } from "@nestjs/common";
import { VotesController } from "./votes.controller";
import { VotesService } from "./votes.service";
import { VoteModule } from "./vote/vote.module";
import { CommentsModule } from "./vote/comments/comments.module";

/**
 * Vote module
 */
@Module({
    imports: [ VoteModule, CommentsModule ],
    controllers: [ VotesController ],
    providers: [ VotesService ]
})
export class VotesModule {}
