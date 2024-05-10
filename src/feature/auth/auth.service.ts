import { ConflictException, Injectable } from "@nestjs/common";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { SignupResponseDto } from "./dto/signupResponse.dto";
import { CryptoService } from "@/global/crypto.service";
import { DataSource } from "typeorm";
import { User } from "@/global/model/db/user";

@Injectable()
export class AuthService {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly db: DataSource
    ) {}

    async signUp(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
        const query = this.db.createQueryRunner();

        try {
            await query.connect();
            throw new Error("Method not implemented.");
        } catch (e) {
            throw new Error("Method not implemented.");
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
        } catch (error) {
            throw error;
        } finally {
            await query.release();
        }
    }
}
