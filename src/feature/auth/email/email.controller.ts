import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { SendCodeResponseDto } from "../dto/sendCodeResponse.dto";

@Controller("auth/signup/email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post("verify")
    public async emailVerify() {}

    @Post("code")
    public async emailCodeSend(
        @Body("email") email: string
    ): Promise<SendCodeResponseDto> {
        return await this.emailService.sendCode(email);
    }
}
