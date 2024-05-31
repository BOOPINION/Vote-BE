import { LikeService } from "@/feature/votes/vote/like/like.service";
import { Controller, Get, HttpException, HttpStatus, Logger, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetLikesResponseDto } from "@/feature/votes/vote/like/dto/GetLikesResponse.dto";
import { GetLikeResponseDto } from "@/feature/votes/vote/like/dto/GetLikeResponse.dto";
import { DoLikeResponseDto } from "@/feature/votes/vote/like/dto/DoLikeResponse.dto";

@ApiTags("votes")
@Controller("votes/:voteId/like")
export class LikeController {
    public constructor(private readonly likeService: LikeService) {}

    @Get()
    public async getLikes(
        @Param("voteId") voteId: number
    ): Promise<GetLikesResponseDto> {
        const result = await this.likeService.getLikes(voteId);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Get(":userId")
    public async getLike(
        @Param("voteId") voteId: number,
            @Param("userId") userId: number
    ): Promise<GetLikeResponseDto> {
        const result = await this.likeService.getLike(voteId, userId);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Put(":userId")
    public async doLike(
        @Param("voteId") voteId: number,
            @Param("userId") userId: number
    ): Promise<DoLikeResponseDto> {
        const result = await this.likeService.doLike(voteId, userId);

        if (!result.success) {
            const { error } = result;
            Logger.error(error);
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }
}
