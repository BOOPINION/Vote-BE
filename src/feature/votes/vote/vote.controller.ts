import { Controller, Get, HttpException, Param } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { DatabaseError } from "@/global/error/DatabaseError";

@Controller("votes/:voteId")
export class VoteController {
    public constructor(private readonly voteService: VoteService) {
    }
    @Get()
    public async getVote(@Param("voteId") voteId: number) {
        try {
            return this.voteService.getVote(voteId);
        } catch (e) {
            if (e instanceof DatabaseError) {
                throw new HttpException(e.message, 404);
            } else {
                throw new HttpException("Internal server error", 500);
            }
        }
    }
}
