import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: () => ({
    type: 'mysql',
    host: process.env.DB_HOST, //config.get<string>("DB_HOST"),
    port: Number(process.env.DB_PORT), //config.get<number>("DB_PORT"),
    username: process.env.DB_USER, //config.get<string>("DB_USER"),
    password: process.env.DB_PW, //config.get<string>("DB_PW"),
    database: process.env.DB_DB, //config.get<string>("DB_DB"),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: Boolean(process.env.DB_SYNCHRONIZE), //config.get<boolean>("DB_SYNCHRONIZE"),
  }),
};
