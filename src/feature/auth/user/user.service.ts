import { Injectable } from '@nestjs/common';
import { DataSource} from 'typeorm';
import { User, UserPersonalInfo } from '@/global/model/db/user';
import { GetProfileResponseDto } from '../dto/getProfileResponse.dto';
import { UpdateProfileRequestDto } from '../dto/updateProfileRequest.dto';
import { GetProfileRequestDto } from '../dto/getProfileRequest.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly db: DataSource
    ) {}

    async getProfile(getProfileRequestDto: GetProfileRequestDto): Promise<GetProfileResponseDto> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
    
            const user = await query.manager.findOne(User, {
                where: { email : getProfileRequestDto.email },
                relations: ['personalInfo'] 
            });
    
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
    
            const { id, email, name: username } = user;
            const personalInfo = user.personalInfo;
    
            const profileResponse: GetProfileResponseDto = {
                id,
                email,
                username,
                personalInfo: personalInfo ? {
                    gender: personalInfo.gender,
                    age: personalInfo.age
                } : {
                    gender: null,
                    age: null
                }
            };
            return profileResponse;
    
        } catch (e) {
            throw new Error(`Error in getProfile method: ${e.message}`);
        } finally {
            await query.release();
        }
    }

    async updateProfile(updateProfileDto: UpdateProfileRequestDto): Promise<void> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
    
            const user = await query.manager.findOne(User, {
                where: { email : updateProfileDto.email },
                relations: ['personalInfo']
            });
    
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
    
            if (updateProfileDto.username) {
                user.name = updateProfileDto.username;
            }
    
            await query.manager.save(user);
    
        } catch (e) {
            throw new Error(`Error in updateProfile method: ${e.message}`);
        } finally {
            await query.release();
        }
    }
}