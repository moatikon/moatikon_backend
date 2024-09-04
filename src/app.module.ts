import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "./common/common.module";
import { TikonModule } from './tikon/tikon.module';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "/Users/ljyo2o9/Documents/Gitkra/moatikon_backend/src/configs/.env",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        entities: [__dirname + "/../**/*.entity.{js,ts}"],
        synchronize: config.get<boolean>("DB_SYNCHRONIZE"),
      }),
    }),
    UserModule,
    CommonModule,
    TikonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
