import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { Logger } from "@nestjs/common";
import { serverPort } from "./configs/configs";
import { BaseExceptionFilter } from "./exception/base-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = serverPort; // 3000

  app.useGlobalFilters(new BaseExceptionFilter());
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
