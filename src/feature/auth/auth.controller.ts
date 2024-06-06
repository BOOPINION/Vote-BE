import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { LoginRequestDto } from "./dto/loginRequest.dto";
import { DeleteUserRequestDto } from "./dto/deleteUserRequest.dto";
import { JwtAuthGuard } from "../../global/jwt-auth.guard";
import { ChangePasswordRequestDto } from "./dto/changePasswordRequest.dto";
import { ResetPasswordRequestDto } from "./dto/resetPasswordRequest.dto";

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
    ): Promise<{ accessToken: string }> {
        try {
            return this.authService.login(loginRequestDto);
        } catch (e) {
            throw Error(`Error in controller login method: ${e.message}`);
        }
    }

    @Post("user/change-password")
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @Body() changePasswordRequestDto: ChangePasswordRequestDto
    ): Promise<void> {
        try {
            return this.authService.changePassword(changePasswordRequestDto);
        } catch (e) {
            throw Error(`Error in controller changePassword method: ${e.message}`);
        }
    }

    @Post("pw/reset")
    @UseGuards(JwtAuthGuard)
    async resetPassword(
        @Body() resetPasswordRequestDto: ResetPasswordRequestDto
    ): Promise<string> {
        try {
            return this.authService.resetPassword(resetPasswordRequestDto);
        } catch (e) {
            throw Error(`Error in controller resetPassword method: ${e.message}`);
        }
    }

    @Post("user/withdraw")
    @UseGuards(JwtAuthGuard)
    async deleteUser(
        @Body() deleteUserRequestDto: DeleteUserRequestDto
    ): Promise<void> {
        try {
            return this.authService.deleteUser(deleteUserRequestDto);
        } catch (e) {
            throw Error(`Error in controller deleteUser method: ${e.message}`);
        }
    }
}
