import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { CryptoService } from "@/global/crypto.service";
import { DataSource, QueryRunner } from "typeorm";
import { User, UserPersonalInfo } from "@/global/model/db/user";
import { JwtService } from "@nestjs/jwt";
import { LoginRequestDto } from "./dto/loginRequest.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly db: DataSource,
        private jwtService: JwtService
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
            const newUser: User = query.manager.create(User, {
                name,
                email,
                password: encPassword,
                status: "USER",
                passwordSalt
            });

            await query.manager.save(newUser);

            const newUserPersonal: UserPersonalInfo = query.manager.create(
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

    async login(loginRequestDto: LoginRequestDto): Promise<{ accessToken: string }> {
        const query = this.db.createQueryRunner();
        const { email, password } = loginRequestDto;

        try {
            await query.connect();
            const user = await query.manager.findOne(User, {
                where: { email }
            });
            if (user == null) {
                throw new UnauthorizedException("사용자가 없습니다.");
            }
            const EncryptedPassword = this.cryptoService.decipher(password, user);

            if (!user) {
                throw new UnauthorizedException("해당 이메일을 가진 사용자를 찾을 수 없습니다.");
            }
            if (await EncryptedPassword != user.password) {
                throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
            }

            const payload = { email, uid: user.id };
            const accessToken = this.jwtService.sign(payload);

            console.log(accessToken);

            return { accessToken };
        } catch (e) {
            throw new Error(`Error in login method: ${e.message}`);
        } finally {
            await query.release();
        }

    }
}

