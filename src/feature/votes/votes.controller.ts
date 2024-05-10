import { Controller, Get, HttpException, HttpStatus, Query } from "@nestjs/common";
import { VotesService } from "./votes.service";
import { GetVotesResponseDto } from "./dto/GetVotesResponse.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("votes")
@Controller("votes")
export class VotesController {
    constructor(
        private readonly votesService: VotesService
    ) {}

    @Get()
    public async getVotes(@Query("page") page?: number): Promise<GetVotesResponseDto> {
        try {
            const votes = await this.votesService.getVotes(page);
            const response = new GetVotesResponseDto();
            response.votes = votes.votes;

            return response;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
