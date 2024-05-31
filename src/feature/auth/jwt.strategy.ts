import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DataSource } from "typeorm";
import { User } from "@/global/model/db/user";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly db: DataSource
    ) {
        super({
            secretOrKey: "Secret1234",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }


    async validate(payload: { email: string }) {
        const queryRunner = this.db.createQueryRunner();
        try {
            await queryRunner.connect();
            const { email } = payload;
            const user = await queryRunner.manager.findOne(User, { where: { email } });

            if (!user) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (e) {
            throw new UnauthorizedException(`Error in validate method: ${e.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}
