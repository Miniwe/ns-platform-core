import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

import { CacheOptions, CacheOptionsSchema } from './schemas/advanced-cache.schema';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { REDIS_CLIENT } from './constants';

@Injectable()
export class AdvancedCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(AdvancedCacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly errorHandlingService: ErrorHandlingService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      if (error instanceof Error) {
        this.errorHandlingService.logWarn(`Cache GET failed for key: ${key}`, {
          error: error.message,
        });
      }
      return undefined;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const validated = CacheOptionsSchema.parse(options ?? {});
      const ttl = validated.ttl ?? 60 * 60 * 1000;

      await this.cacheManager.set(key, value, ttl);

      if (validated.tags?.length) {
        const pipeline = this.redis.pipeline();

        for (const tag of validated.tags) {
          pipeline.sadd(this.getTagKey(tag), key);
        }

        await pipeline.exec();
      }
    } catch (error) {
      if (error instanceof Error) {
        this.errorHandlingService.logWarn(`Cache SET failed for key: ${key}`, {
          error: error.message,
        });
      }
    }
  }

  /**
   * Удаление ключа из кэша.
   * Не выбрасывает исключения — фейл кэша не должен ломать бизнес-логику.
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      if (error instanceof Error) {
        this.errorHandlingService.logWarn(`Cache DEL failed for key: ${key}`, {
          error: error.message,
        });
      }
    }
  }

  async invalidateTag(tag: string): Promise<number> {
    const tagKey = this.getTagKey(tag);

    try {
      const keys = await this.redis.smembers(tagKey);

      if (!keys.length) {
        await this.redis.del(tagKey);
        return 0;
      }

      await Promise.all(keys.map((key) => this.cacheManager.del(key)));

      await this.redis.del(tagKey);
      return keys.length;
    } catch (error) {
      if (error instanceof Error) {
        this.errorHandlingService.logWarn(`Cache tag invalidation failed for tag: ${tag}`, {
          error: error.message,
        });
      }
      return 0;
    }
  }

  /**
   * Инвалидация всех ключей с указанным тегом.
   */
  async invalidateTags(tags: string[]): Promise<number> {
    const uniqueTags = [...new Set(tags)].filter(Boolean);

    if (!uniqueTags.length) {
      return 0;
    }

    let total = 0;

    for (const tag of uniqueTags) {
      total += await this.invalidateTag(tag);
    }

    return total;
  }

  async wrap<T>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  async ping(): Promise<boolean> {
    try {
      const res = await this.redis.ping();
      return res === 'PONG';
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn(`Redis ping failed: ${error.message}`);
      }
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }

  private getTagKey(tag: string | symbol): string {
    return `tag:${String(tag)}`;
  }

  async incr(key: string) {
    return await this.redis.incr(key);
  }

  async expire(key: string, seconds: number) {
    await this.redis.expire(key, seconds);
  }

  async ttl(key: string) {
    return await this.redis.ttl(key);
  }

  async flushAll() {
    await this.redis.flushall();
  }

  async getWithFallback<T>(
    key: string,
    fallback: () => Promise<T>,
    options?: CacheOptions,
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== undefined) {
      return cached;
    }

    const result = await fallback();
    await this.set(key, result, options);

    return result;
  }
}
