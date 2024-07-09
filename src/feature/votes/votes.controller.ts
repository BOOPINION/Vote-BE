import { Controller, Get, HttpException, HttpStatus, Logger, Query } from "@nestjs/common";
import { VotesService } from "./votes.service";
import { GetVotesResponseDto } from "./dto/GetVotesResponse.dto";
import { ApiTags } from "@nestjs/swagger";
import { DatabaseError } from "@/global/error/DatabaseError";
import { ZeroResultError } from "@/global/error/ZeroResultError";

@ApiTags("votes")
@Controller("votes")
export class VotesController {
    constructor(
        private readonly votesService: VotesService
    ) {}

    @Get()
    public async getVotes(
        @Query("page") page?: number,
            @Query("size") size?: number
    ): Promise<GetVotesResponseDto> {
        const result = await this.votesService.getVotes(page, size);
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
