import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailVerifyRequestDto } from "./dto/emailVerifyRequest.dto";

@Controller("auth/signup/email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post("verify")
    public async emailVerify(
        @Body() emailVerifyRequestDto: EmailVerifyRequestDto
    ): Promise<boolean> {
        return await this.emailService.verifyCode(emailVerifyRequestDto);
    }

    @Post("code")
    public async emailCodeSend(@Body("email") email: string): Promise<void> {
        return await this.emailService.sendCode(email);
    }
}
