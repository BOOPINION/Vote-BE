import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { GetProfileResponseDto } from "../dto/getProfileResponse.dto";
import { UpdateProfileRequestDto } from "../dto/updateProfileRequest.dto";
import { JwtAuthGuard } from "../../../global/jwt-auth.guard";
import { GetProfileRequestDto } from "../dto/getProfileRequest.dto";

@Controller("auth")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("/user")
    @UseGuards(JwtAuthGuard)
    public async getProfile(
        @Body() getProfileRequestDto: GetProfileRequestDto
    ): Promise<GetProfileResponseDto> {
        try {
            return this.userService.getProfile(getProfileRequestDto);
        } catch (e) {
            throw Error(`Error in controller getProfile method: ${e.message}`);
        }
    }

    @Patch("user/update")
    @UseGuards(JwtAuthGuard)
    public async updateProfile(
        @Body() updateProfileDto: UpdateProfileRequestDto
    ): Promise<void> {
        try {
            return this.userService.updateProfile(updateProfileDto);
        } catch (e) {
            throw Error(`Error in controller updateProfile method: ${e.message}`);
        }
    }
}
