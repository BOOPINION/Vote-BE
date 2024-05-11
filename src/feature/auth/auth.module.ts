import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GlobalModule } from "@/global/global.module";

/**
 * Auth module
 */
@Module({
    imports: [],
    controllers: [ AuthController ],
    providers: [ AuthService ]
})
export class AuthModule {}
