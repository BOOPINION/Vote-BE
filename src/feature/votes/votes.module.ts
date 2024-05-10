import { Module } from "@nestjs/common";
import { VotesController } from "./votes.controller";
import { VotesService } from "./votes.service";
import { VoteModule } from "./vote/vote.module";


/**
 * Vote module
 */
@Module({
    imports: [ VoteModule ],
    controllers: [ VotesController ],
    providers: [ VotesService ]
})
export class VotesModule {}
