import { Module } from '@nestjs/common';
import { RedisUtilService } from './redis-util.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>("REDIS_URL"),
        options: {
          password: config.get<string>("REDIS_PW"),
        }
      }),
    }),
  ],
  providers: [RedisUtilService],
  exports: [RedisUtilService],
})
export class RedisUtilModule {}
