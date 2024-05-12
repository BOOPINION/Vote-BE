import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail() {
        try {
            await this.mailerService.sendMail({
                to: "testEmail",
                from: process.env.MAIL_HOST,
                subject: "test 제목",
                text: "test 텍스트",
                html: "<b>test<b>"
            });

            return true;
        } catch (e) {
            throw new Error(`Error in sendEmail method: ${e.message}`);
        }
    }
}
