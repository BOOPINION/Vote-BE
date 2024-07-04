import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import setupSwagger from "./swagger";
import { requestLogger } from "@/global/request-logger.middleware";
import "reflect-metadata";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: [ "log", "warn", "error", "fatal" ]
    });

    // setup global path prefix
    app.setGlobalPrefix("api");

    // setup configs
    setupSwagger(app);
    app.use(requestLogger);

    const configs = app.get(ConfigService);

    const port = configs.get<number>("SERVER_PORT");

    if (!port) {
        console.error("Invalid port. Please check .env file.");
        process.exit(1);
    }

    await app.listen(port);
}

bootstrap();
