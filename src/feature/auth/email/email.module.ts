import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    service: "gmail",
                    host: configService.get<string>("MAIL_HOST"),
                    port: configService.get<number>("MAIL_PORT"),
                    auth: {
                        user: configService.get<string>("MAIL_USER"),
                        pass: configService.get<string>("MAIL_PASSWORD")
                    }
                },
                defaults: {
                    from: "\"nest-modules\" <modules@nestjs.com>"
                }
            })
        })
    ],
    controllers: [ EmailController ],
    providers: [ EmailService ]
})
export class EmailModule {}
