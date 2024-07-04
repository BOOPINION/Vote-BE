import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { EmailVerifyRequestDto } from "./dto/emailVerifyRequest.dto";
import { CodeStore } from "./codestore";

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly codestore: CodeStore
    ) {}

    async sendCode(email: string): Promise<void> {
        try {
            const code = Math.floor(Math.random() * 1000000).toString();
            await this.mailerService.sendMail({
                to: email,
                from: process.env.MAIL_HOST,
                subject: "Verification code",
                text: `Your verification code is ${code}`
            });

            this.codestore.saveCode(email, code);
        } catch (e) {
            throw new Error(`Error in sendEmail method: ${e.message}`);
        }
    }

    async verifyCode(
        emailVerifyRequestDto: EmailVerifyRequestDto
    ): Promise<boolean> {
        try {
            const { email, state } = emailVerifyRequestDto;
            const storedCode = this.codestore.getCode(email);

            if (!storedCode) {
                throw new Error("인증 코드를 찾을 수 없습니다.");
            }

            if (state.code === storedCode) {
                this.codestore.removeCode(email);
                state.verified = true;
            } else {
                throw new Error("일치하지 않은 코드입니다.");
            }
            return state.verified;
        } catch (e) {
            throw new Error(`Error in verifyCode method: ${e.message}`);
        }
    }
}
