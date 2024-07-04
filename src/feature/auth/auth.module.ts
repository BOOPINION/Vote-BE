import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EmailModule } from "./email/email.module";
import { JwtModule, JwtSecretRequestType, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../../global/jwt.strategy";
import { GlobalModule } from "@/global/global.module";
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
    providers: [ AuthService, JwtStrategy ],
    exports: [ AuthService, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
