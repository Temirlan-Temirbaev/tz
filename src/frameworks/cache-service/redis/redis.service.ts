import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';
import { ICacheService } from '../../../core/abstracts/cache-service.abstract';


@Injectable()
export class RedisService implements ICacheService{
  constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClient) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, serializedValue, 'EX', ttl);
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushdb();
  }
}