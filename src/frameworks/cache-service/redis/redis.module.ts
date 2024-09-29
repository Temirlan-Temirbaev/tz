import { Module } from '@nestjs/common';
import { ICacheService } from 'src/core/abstracts/cache-service.abstract';
import { RedisService } from './redis.service';
import { redisProvider } from './redis.provider';

@Module({
  providers: [
    redisProvider,
    {
      provide: ICacheService,
      useClass: RedisService,
    },
  ],
  exports: [ICacheService],
})
export class RedisModule {}
