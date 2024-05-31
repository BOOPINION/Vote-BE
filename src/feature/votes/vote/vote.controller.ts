import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Logger, Param, Post } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { DatabaseError } from "@/global/error/DatabaseError";
import { ZeroResultError } from "@/global/error/ZeroResultError";
import { CreateVoteRequestDto } from "@/feature/votes/dto/CreateVoteRequest.dto";
import { GetVoteResponseDto } from "@/feature/votes/dto/GetVoteResponse.dto";
import { CreateVoteResponseDto } from "@/feature/votes/dto/CreateVoteResponse.dto";
import { ApiTags } from "@nestjs/swagger";
import { DeleteVoteResponseDto } from "@/feature/votes/dto/DeleteVoteResponse.dto";

@ApiTags("votes")
@Controller("votes")
export class VoteController {
    public constructor(private readonly voteService: VoteService) {}

    @Get(":voteId")
    public async getVote(
        @Param("voteId") voteId: number
    ): Promise<GetVoteResponseDto> {
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

    @Post("/create")
    public async createVote(
        @Headers("Authorization") tokenHeader: string, @Body() params: CreateVoteRequestDto
    ): Promise<CreateVoteResponseDto> {
        const result = await this.voteService.createVote(params);
        if (!result.success) {
            const { error } = result;
            Logger.error(error);

            throw new HttpException("Database Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Delete(":voteId")
    public async deleteVote(
        @Headers("Authorization") tokenHeader: string,  @Param("voteId") voteId: number
    ): Promise<DeleteVoteResponseDto> {
        const result = await this.voteService.deleteVote(voteId);
        if (!result.success) {
            const { error } = result;
            Logger.error(error);

            throw new HttpException("Database Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }
}
