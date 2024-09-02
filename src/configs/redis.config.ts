import { RedisModuleOptions } from "@nestjs-modules/ioredis";
import {
  redisHost,
  redisPassword,
  redisPort,
  redisUser,
} from "src/configs/configs";

export const redisConfig: RedisModuleOptions = {
  type: "single",
  options: {
    host: redisHost,
    port: redisPort,
    username: redisUser,
    password: redisPassword,
  },
};
