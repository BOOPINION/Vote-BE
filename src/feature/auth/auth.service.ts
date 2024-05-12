import { Injectable } from "@nestjs/common";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { CryptoService } from "@/global/crypto.service";
import { DataSource, QueryRunner } from "typeorm";
import { User, UserPersonalInfo } from "@/global/model/db/user";

@Injectable()
export class AuthService {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly db: DataSource
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
}
