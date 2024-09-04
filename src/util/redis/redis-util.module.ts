import { Module } from "@nestjs/common";
import { RedisUtilService } from "./redis-util.service";
import { RedisModule } from "@nestjs-modules/ioredis";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: "single",
      options: {
        host: config.get<string>("REDIS_HOST"),
        port: config.get<number>("REDIS_POST"),
        username: config.get<string>("REDIS_USER"),
        password: config.get<string>("REDIS_PASSWORD"),
      },
    }),
  })],
  providers: [RedisUtilService],
  exports: [RedisUtilService],
})
export class RedisUtilModule {}