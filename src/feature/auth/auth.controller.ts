import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/signupRequest.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    public async signUp(@Body() signupRequestDto: SignupRequestDto) {
        try {
            return this.authService.signUp(signupRequestDto);
        } catch (e) {
            throw Error(`Error in controller signUp method: ${e.message}`);
        }
    }
}
