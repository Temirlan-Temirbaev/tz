import { Module } from '@nestjs/common';
import { RedisModule } from '../../frameworks/cache-service/redis/redis.module';

@Module({
  imports: [RedisModule],
  exports: [RedisModule],
})
export class CacheServiceModule {}