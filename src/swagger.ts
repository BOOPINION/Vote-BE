import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default function setupSwagger(app: INestApplication) {
    const swagger = new DocumentBuilder()
        .setTitle("API")
        .setDescription("PnP 2024-01 Web Project Team API")
        .setVersion("0.0.1")
        .addTag("auth")
        .addTag("vote")
        .build();

    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup("api", app, document);
}
