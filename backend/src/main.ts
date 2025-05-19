import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalExceptionsFilter } from "../src/filters/global-exception.filter";
import { config } from "dotenv";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "Authorization", 
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API Documentation")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "bearer"
    )
    .addSecurityRequirements("bearer")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swag", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalFilters(new GlobalExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
