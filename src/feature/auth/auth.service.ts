import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { CryptoService } from "@/global/crypto.service";
import { DataSource, QueryRunner } from "typeorm";
import { User, UserPersonalInfo } from "@/global/model/db/user";
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { ChangePasswordRequestDto } from './dto/changePasswordRequest.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { DeleteUserRequestDto } from './dto/deleteUserRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly db: DataSource,
        private jwtService: JwtService,
        private readonly mailerService: MailerService
    ) {}

    async signUp(signupRequestDto: SignupRequestDto): Promise<void> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
            await query.startTransaction();

            const { email } = signupRequestDto;
            const findUser = await this.findUserByEmail(email);

            if (findUser) {
                throw new Error("사용할 수 없는 이메일입니다.");
            } else {
                await this.createUser(query, signupRequestDto);
            }

            await query.commitTransaction();
        } catch (e) {
            await query.rollbackTransaction();
            throw new Error(`Error in signUp method: ${e.message}`);
        } finally {
            await query.release();
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
            const existingUser = await query.manager.findOne(User, {
                where: { email }
            });
            return existingUser;
        } catch (e) {
            throw new Error(`Error in findUserByEmail method: ${e.message}`);
        } finally {
            await query.release();
        }
    }

    async createUser(
        query: QueryRunner,
        signupRequestDto: SignupRequestDto
    ): Promise<void> {
        const { name, email, password, gender, age } = signupRequestDto;
        const passwordSalt = await this.cryptoService.generateSalt();
        const encPassword = await this.cryptoService.encrypt(
            password,
            passwordSalt
        );
        try {
            const newUser: User = await query.manager.create(User, {
                name,
                email,
                password: encPassword,
                passwordSalt
            });
            await query.manager.save(newUser);

            const newUserPersonal: UserPersonalInfo = await query.manager.create(
                UserPersonalInfo,
                {
                    userId: newUser.id,
                    gender,
                    age
                }
            );
            await query.manager.save(newUserPersonal);
        } catch (e) {
            throw new Error(`Error in createUser method: ${e.message}`);
        }
    }

    async login(loginRequestDto: LoginRequestDto): Promise<{accessToken: string}>{
        const query = this.db.createQueryRunner();
        const {email, password} = loginRequestDto;
        try{
            await query.connect();
            const user = await query.manager.findOne(User, {
                where: { email }
            });
            if(!user){
                throw new UnauthorizedException('해당 이메일을 가진 사용자를 찾을 수 없습니다.')
            }
            /*const EncryptedPassword = await this.cryptoService.decipher(password, user);
            if ( EncryptedPassword != user.password) {
                throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
            }*/

            const encryptedPassword = await this.cryptoService.encrypt(password, user.passwordSalt);
            if (encryptedPassword !== user.password) {
                throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
            }

            const payload = { email };
            const accessToken = await this.jwtService.sign(payload);
            return {accessToken};
        } catch(e){
            throw new Error(`Error in login method: ${e.message}`);
        } finally {
            await query.release();
        }
    }
    
    async changePassword(changePasswordRequestDto: ChangePasswordRequestDto): Promise<void> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
            await query.startTransaction();

            const {email, exPassword, newPassword} = changePasswordRequestDto;
    
            const user = await query.manager.findOne(User, {
                where: { email }
            });
            if (!user) {
                throw new UnauthorizedException('해당 이메일을 가진 사용자를 찾을 수 없습니다.');
            }
    
            const encryptedExPassword = await this.cryptoService.encrypt(exPassword, user.passwordSalt);
            console.log(encryptedExPassword);
            console.log(user.password);
            if (encryptedExPassword !== user.password) {
                throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
            }
    
            const newPasswordSalt = await this.cryptoService.generateSalt();
            const encryptedNewPassword = await this.cryptoService.encrypt(newPassword, newPasswordSalt);
    
            user.password = encryptedNewPassword;
            user.passwordSalt = newPasswordSalt;
    
            await query.manager.save(user);
            await query.commitTransaction();
        } catch (e) {
            await query.rollbackTransaction();
            throw new Error(`Error in changePassword method: ${e.message}`);
        } finally {
            await query.release();
        }
    }

    async resetPassword(resetPasswordRequestDto: ResetPasswordRequestDto): Promise<string> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
            await query.startTransaction();
            const { email, password } = resetPasswordRequestDto;
    
            const user = await query.manager.findOne(User, {
                where: { email}
            });
            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }
            
            const temporaryPassword = this.cryptoService.generateRandomPassword();
            const newPasswordSalt = await this.cryptoService.generateSalt();
            const encryptedNewPassword = await this.cryptoService.encrypt(temporaryPassword, newPasswordSalt);
    
            user.password = encryptedNewPassword;
            user.passwordSalt = newPasswordSalt;
    
            await query.manager.save(user);
            
            await query.commitTransaction();

            return temporaryPassword;
        } catch (e) {
            await query.rollbackTransaction();
            throw new Error(`Error in resetPassword method: ${e.message}`);
        } finally {
            await query.release();
        }
    }
    
    async deleteUser(deleteUserRequestDto: DeleteUserRequestDto): Promise<void> {
        const query = this.db.createQueryRunner();
        try {
            await query.connect();
            await query.startTransaction();

            const user = await query.manager.findOne(User, {
                where: { email: deleteUserRequestDto.email }
            });
            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }
    
            const encryptedPassword = this.cryptoService.encrypt(deleteUserRequestDto.password, user.passwordSalt);
            if (await encryptedPassword !== user.password) {
                throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
            }
    
            await query.manager.remove(user);
            await query.commitTransaction();
        } catch (e) {
            await query.rollbackTransaction();
            throw new Error(`Error in deleteUser method: ${e.message}`);
        } finally {
            await query.release();
        }
    }
}

