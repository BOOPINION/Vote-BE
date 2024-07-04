import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { GetProfileResponseDto } from "../dto/getProfileResponse.dto";
import { JwtAuthGuard } from "../../../global/jwt-auth.guard";
import { User } from '@/global/model/db/user';
import { GetUser } from './get-user.decorator';
import { UpdateProfileRequestDto } from '../dto/updateProfileRequest.dto';

@Controller("auth")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("/user")
    @UseGuards(JwtAuthGuard)
    public async getProfile( @GetUser() user: User): Promise<GetProfileResponseDto> {
        try {
            return this.userService.getProfile(user);
        } catch (e) {
            throw Error(`Error in controller getProfile method: ${e.message}`);
        }
    }

    @Patch("user/update")
    @UseGuards(JwtAuthGuard)
    public async updateProfile(
        @GetUser() user: User, 
        @Body()updateProfileRequestDto : UpdateProfileRequestDto
    ): Promise<{ success: boolean }> {
        try {
            return this.userService.updateProfile(user, updateProfileRequestDto);
        } catch (e) {
            throw Error(`Error in controller updateProfile method: ${e.message}`);
        }
    }
}
