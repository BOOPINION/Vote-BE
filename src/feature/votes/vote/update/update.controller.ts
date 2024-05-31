import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Put } from "@nestjs/common";
import { UpdateService } from "@/feature/votes/vote/update/update.service";
import { UpdateVoteRequestDto } from "@/feature/votes/vote/update/dto/UpdateVoteRequest.dto";

@ApiTags("votes")
@Controller("votes/:voteId/update")
export class UpdateController {
    public constructor(private readonly updateService: UpdateService) {}

    @Get()
    public async getVoteValuesForUpdate(
    @Param("voteId") voteId: number
    ) {
        const result = await this.updateService.getValueForUpdate(voteId);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Put()
    public async updateVote(
    @Param("voteId") voteId: number,
        @Body() params: UpdateVoteRequestDto
    ) {
        const result = await this.updateService.updateVote(voteId, params);
        if (!result.success) {
            const { error } = result;
            Logger.error(error);
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }
}
