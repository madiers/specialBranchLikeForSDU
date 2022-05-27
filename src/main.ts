import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "@/modules/app.module";
import { IConfig, IConfigApp } from "@/config";
import { init as initDocs } from "@/core/documentation";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService<IConfig>>(ConfigService);
  const appConfig = configService.get<IConfigApp>("app")!;

  app.setGlobalPrefix(appConfig.prefix);
  app.useGlobalPipes(new ValidationPipe());

  initDocs(app, appConfig.prefix);

  app.use(helmet());

  await app.listen(appConfig.port);
}

bootstrap();
