import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { SignupResponseDto } from "./dto/signupResponse.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    public async signUp(@Body() signupRequestDto: SignupRequestDto) {
        try {
            return this.authService.signUp(signupRequestDto);
        } catch (e) {
            throw Error("auth error");
        }
    }
}
