import { Module } from "@nestjs/common";
import { RedisUtilService } from "./redis-util.service";
import { RedisModule } from "@nestjs-modules/ioredis";
import { redisConfig } from "src/configs/redis.config";

@Module({
  imports: [RedisModule.forRoot(redisConfig)],
  providers: [RedisUtilService],
  exports: [RedisUtilService],
})
export class RedisUtilModule {}
