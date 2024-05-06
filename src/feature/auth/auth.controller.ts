import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { SignupResponseDto } from "./dto/signupResponse.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    signUp(
        @Body() signupRequestDto: SignupRequestDto
    ): Promise<SignupResponseDto> {
        return this.authService.signUp(signupRequestDto);
    }
}
