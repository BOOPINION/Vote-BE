import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { SendCodeResponseDto } from "./dto/sendCodeResponse.dto";
import { EmailVerifyRequestDto } from "./dto/emailVerifyRequest.dto";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCode(email: string): Promise<SendCodeResponseDto> {
    try {
      const code = Math.floor(Math.random() * 1000000).toString();
      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL_HOST,
        subject: "Verification code",
        text: `Your verification code is ${code}`,
      });

      const state: SendCodeResponseDto = {
        email,
        state: {
          code,
          verified: false,
        },
      };
      return state;
    } catch (e) {
      throw new Error(`Error in sendEmail method: ${e.message}`);
    }
  }

  async verifyCode(
    emailVerifyRequestDto: EmailVerifyRequestDto
  ): Promise<boolean> {
    try {
      const { state, verifyCode } = emailVerifyRequestDto;
      if (state.code === verifyCode) {
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
