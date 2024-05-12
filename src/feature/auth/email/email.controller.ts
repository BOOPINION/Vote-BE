import { Controller, Get, Post } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("auth/signup/email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Get()
    test() {
        this.emailService.sendEmail();
    }

    @Post("verify")
    public async emailVerify() {}

    @Post("code")
    public async emailCodeSend() {}
}
