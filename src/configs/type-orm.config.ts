import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'mysql',
    host: config.get<string>("DB_HOST"),
    port: config.get<number>("DB_PORT"),
    username: config.get<string>("DB_USER"),
    password: config.get<string>("DB_PW"),
    database: config.get<string>("DB_DB"),
    synchronize: config.get<boolean>("DB_SYNCHRONIZE"),
  }),
};
