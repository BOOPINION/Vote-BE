import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "@/global/model/db/user";
import { GetProfileResponseDto } from "../dto/getProfileResponse.dto";
import { UpdateProfileRequestDto } from "../dto/updateProfileRequest.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        private readonly db: DataSource
    ) {}

    async getProfile(user: User): Promise<GetProfileResponseDto> {
        try {
            const userWithInfo = await this.db.manager.findOne(User, {
                where: {
                    id: user.id
                },
                relations: ["personalInfo"]
            });

            if (!userWithInfo) {
                throw new Error("사용자를 찾을 수 없습니다.");
            }

            const { id, email, name: username } = userWithInfo;
            const personalInfo = userWithInfo.personalInfo;

            const profileResponse: GetProfileResponseDto = {
                id,
                email,
                username,
                personalInfo: personalInfo
                    ? {
                        gender: personalInfo.gender,
                        age: personalInfo.age
                    }
                    : {
                        gender: null,
                        age: null
                    }
            };
            return profileResponse;

        } catch (e) {
            throw new Error(`Error in getProfile method: ${e.message}`);
        }
    }

    async updateProfile(user: User, updateProfileRequestDto: UpdateProfileRequestDto): Promise<{ success: boolean }> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
            await query.startTransaction();

            const userInfo = await query.manager.findOne(User, {
                where: {
                    id: user.id
                },
                relations: [ "personalInfo" ]
            });

            if (!userInfo) {
                throw new Error("사용자를 찾을 수 없습니다.");
            }

            if (updateProfileRequestDto.username) {
                userInfo.name = updateProfileRequestDto.username;
            }

            if (updateProfileRequestDto.gender) {
                userInfo.personalInfo.gender = updateProfileRequestDto.gender;
            }
            if (updateProfileRequestDto.age) {
                userInfo.personalInfo.age = updateProfileRequestDto.age;
            }

            await query.manager.save(userInfo);
            await query.manager.save(userInfo.personalInfo);

            await query.commitTransaction();

            return { success: true };
        } catch (e) {
            await query.rollbackTransaction();
            throw new Error(`Error in updateProfile method: ${e.message}`);
        } finally {
            await query.release();
        }
    }
}
