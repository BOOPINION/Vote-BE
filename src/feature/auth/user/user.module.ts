import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserPersonalInfo } from '@/global/model/db/user';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserPersonalInfo])
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}