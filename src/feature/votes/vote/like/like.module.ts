import { Module } from "@nestjs/common";
import { LikeController } from "@/feature/votes/vote/like/like.controller";
import { LikeService } from "@/feature/votes/vote/like/like.service";

@Module({
    imports: [],
    controllers: [ LikeController ],
    providers: [ LikeService ]
})
export class LikeModule {}
