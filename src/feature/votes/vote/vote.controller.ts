import { Controller, Get, HttpException, HttpStatus, Logger, Param } from "@nestjs/common";
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

            if (error instanceof DatabaseError) throw new HttpException("Database Error", HttpStatus.INTERNAL_SERVER_ERROR);
            if (error instanceof ZeroResultError) throw new HttpException("There is no vote", HttpStatus.NOT_FOUND);
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;

    }
}
