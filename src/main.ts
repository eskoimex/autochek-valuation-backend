import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import * as xss from "xss-clean";
import hpp from "hpp";
import { AppDataSource } from "../ormconfig";
import { ValidationPipe } from "./common/pipes/validation.pipe";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  await AppDataSource.initialize();

  const appTemp = await NestFactory.create(AppModule, { bodyParser: false });
  const config = appTemp.get(ConfigService);
  await appTemp.close();

  const logger = WinstonModule.createLogger({
    level: config.get("LOG_LEVEL") || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()],
  });

  const app = await NestFactory.create(AppModule, { logger });

  app.use(helmet());
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(mongoSanitize());
  app.use(xss.default());
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
      max: Number(process.env.RATE_LIMIT_MAX || 100),
    })
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle("Autochek Valuation API")
    .setDescription("Vehicle valuation and financing")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("docs", app, doc);

  const port = config.get("PORT") || 3000;
  await app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
}

bootstrap();
