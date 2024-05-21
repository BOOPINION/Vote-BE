import { Body, Controller, Get, Put, Param, Post, Delete, UnprocessableEntityException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { LoginRequestDto } from './dto/loginRequest.dto';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    public async signUp(
        @Body() signupRequestDto: SignupRequestDto
    ): Promise<void> {
        try {
            return this.authService.signUp(signupRequestDto);
        } catch (e) {
            throw Error(`Error in controller signUp method: ${e.message}`);
        }
    }

    @Post("/login")
    public async login(
        @Body() loginRequestDto: LoginRequestDto
    ): Promise<{accessToken: string}> {
        try {
            return this.authService.login(loginRequestDto);
        } catch (e) {
            throw Error(`Error in controller login method: ${e.message}`);
        }
    }
}