import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {dbType, dbHost, dbPort, dbUsername, dbPassword, dbDatabase, dbSynchronize} from './configs';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbType,
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbSynchronize,
};
