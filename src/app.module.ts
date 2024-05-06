import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./feature/auth/auth.module";
import { VoteModule } from "./feature/vote/vote.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

/**
 * Root module
 */
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [ "./model/db/*" ]
        }),
        AuthModule,
        VoteModule
    ],
    controllers: [ AppController ],
    providers: [ AppService ]
})
export class AppModule {}
