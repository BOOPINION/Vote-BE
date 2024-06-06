import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EmailModule } from "./email/email.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../../global/jwt.strategy";
import { GlobalModule } from "@/global/global.module";
import { JwtAuthGuard } from "../../global/jwt-auth.guard";
import { UserModule } from "./user/user.module";

/**
 * Auth module
 */
@Module({
    imports: [ EmailModule,
        UserModule,
        GlobalModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: "Secret1234",
            signOptions: {
                expiresIn: 60 * 60
            }
        })
    ],
    controllers: [ AuthController ],
    providers: [ AuthService, JwtStrategy, JwtAuthGuard ],
    exports: [ JwtStrategy, PassportModule ]
})
export class AuthModule {}
