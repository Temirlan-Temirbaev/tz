import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { CONFIG } from 'src/config';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: CONFIG.redisHost,
      port: +CONFIG.redisPort,
    });
  },
  provide: 'REDIS_CLIENT',
};
