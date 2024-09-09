import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisUtilService {
  constructor(
    @InjectRedis()
    private redisService: Redis,
  ) {}

  async get(key: string): Promise<string> {
    return await this.redisService.get(key);
  }

  async set(key: string, value: string): Promise<void>;
  async set(key: string, value: string, ttl: number): Promise<void>;
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) await this.redisService.set(key, value, 'EX', ttl);
    else await this.redisService.set(key, value);
  }
}
