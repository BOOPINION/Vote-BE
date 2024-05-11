import { Controller, Get, Post } from "@nestjs/common";

@Controller("auth/signup/email")
export class EmailController {
    @Get()
    test() {
        return "auth/signup/email";
    }

    @Post("verify")
    public async emailVerify() {}

    @Post("code")
    public async emailCodeSend() {}
}
