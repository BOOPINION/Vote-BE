import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("auth/signup/email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post("verify")
    public async emailVerify() {}

    @Post("code")
    public async emailCodeSend(@Body("email") email: string) {
        await this.emailService.sendCode(email);
    }
}
