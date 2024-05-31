import { Module } from "@nestjs/common";
import { UpdateService } from "@/feature/votes/vote/update/update.service";
import { UpdateController } from "@/feature/votes/vote/update/update.controller";

@Module({
    imports: [],
    controllers: [ UpdateController ],
    providers: [ UpdateService ]
})
export class UpdateModule {}
