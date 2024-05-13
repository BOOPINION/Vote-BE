import { Controller, Get, HttpException, Logger, Param } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { DatabaseError } from "@/global/error/DatabaseError";
import { ZeroResultError } from "@/global/error/ZeroResultError";

@Controller("votes/:voteId")
export class VoteController {
    public constructor(private readonly voteService: VoteService) {
    }
    @Get()
    public async getVote(@Param("voteId") voteId: number) {

        const result = await this.voteService.getVote(voteId);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);

            if (error instanceof DatabaseError) throw new HttpException("Database Error", 500);
            if (error instanceof ZeroResultError) throw new HttpException("There is no vote", 404);
            throw new HttpException("Internal Server Error", 500);
        }

        return result.value;

    }
}
