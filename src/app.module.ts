import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./feature/auth/auth.module";
import { VotesModule } from "./feature/votes/votes.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { models } from "./global/model/db";
import { GlobalModule } from "./global/global.module";

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
            entities: models
        }),
        GlobalModule,
        AuthModule,
        VotesModule
    ],
    controllers: [ AppController ],
    providers: [ AppService ]
})
export class AppModule {}
