import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { BaseExceptionFilter } from './exception/base-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BaseExceptionFilter());
  const port = 3000;

  await app.listen(port, () => {
    Logger.log(`Server Started at ${port}port`);
  });
}

bootstrap();
