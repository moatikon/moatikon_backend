import { Module } from "@nestjs/common";
import { RedisUtilService } from "./redis-util.service";
import { RedisModule } from "@nestjs-modules/ioredis";
import {
  redisHost,
  redisPassword,
  redisPort,
  redisUser,
} from "src/configs/configs";

@Module({
  imports: [
    RedisModule.forRoot({
      type: "single",
      options: {
        host: redisHost,
        port: redisPort,
        username: redisUser,
        password: redisPassword,
      },
    }),
  ],
  providers: [RedisUtilService],
  exports: [RedisUtilService],
})
export class RedisUtilModule {}
