import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import Redis from 'ioredis';

import { AdvancedCacheService } from './advanced-cache.service';
import { ADVANCED_CACHE_OPTIONS, REDIS_CLIENT } from './constants';
import type {
  AdvancedCacheModuleAsyncOptions,
  AdvancedCacheModuleOptions,
  AdvancedCacheOptionsFactory,
} from './types';

@Global()
@Module({})
export class AdvancedCacheModule {
  static register(options: AdvancedCacheModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: ADVANCED_CACHE_OPTIONS,
      useValue: options,
    };

    const redisClientProvider = this.createRedisClientProvider();
    const cacheModule = CacheModule.registerAsync({
      inject: [ADVANCED_CACHE_OPTIONS],
      useFactory: async (opts: AdvancedCacheModuleOptions) => ({
        isGlobal: true,
        ttl: opts.ttl ?? 60 * 60 * 1000,
        stores: [
          createKeyv(this.buildRedisUrl(opts), {
            namespace: opts.namespace ?? 'platform-core-cache',
          }),
        ],
      }),
    });

    return {
      module: AdvancedCacheModule,
      imports: [cacheModule],
      providers: [optionsProvider, redisClientProvider, AdvancedCacheService],
      exports: [AdvancedCacheService, REDIS_CLIENT, CacheModule],
      global: true,
    };
  }

  static registerAsync(options: AdvancedCacheModuleAsyncOptions): DynamicModule {
    const asyncOptionsProviders = this.createAsyncProviders(options);
    const redisClientProvider = this.createRedisClientProvider();

    const cacheModule = CacheModule.registerAsync({
      imports: options.imports ?? [],
      inject: [ADVANCED_CACHE_OPTIONS],
      useFactory: async (opts: AdvancedCacheModuleOptions) => ({
        isGlobal: true,
        ttl: opts.ttl ?? 60 * 60 * 1000,
        stores: [
          createKeyv(this.buildRedisUrl(opts), {
            namespace: opts.namespace ?? 'platform-core-cache',
          }),
        ],
      }),
    });

    return {
      module: AdvancedCacheModule,
      imports: [...(options.imports ?? []), cacheModule],
      providers: [...asyncOptionsProviders, redisClientProvider, AdvancedCacheService],
      exports: [AdvancedCacheService, REDIS_CLIENT, CacheModule],
      global: true,
    };
  }

  private static createRedisClientProvider(): Provider {
    return {
      provide: REDIS_CLIENT,
      inject: [ADVANCED_CACHE_OPTIONS],
      useFactory: (opts: AdvancedCacheModuleOptions) =>
        new Redis({
          host: opts.host,
          port: opts.port,
          password: opts.password,
          db: opts.db ?? 0,
          maxRetriesPerRequest: opts.maxRetriesPerRequest ?? 2,
          enableReadyCheck: opts.enableReadyCheck ?? true,
          lazyConnect: opts.lazyConnect ?? false,
        }),
    };
  }

  private static createAsyncProviders(options: AdvancedCacheModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: ADVANCED_CACHE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ];
    }

    const useClass = options.useClass as Type<AdvancedCacheOptionsFactory>;

    return [
      {
        provide: ADVANCED_CACHE_OPTIONS,
        useFactory: async (factory: AdvancedCacheOptionsFactory) =>
          await factory.createAdvancedCacheOptions(),
        inject: [options.useExisting ?? useClass],
      },
      ...(options.useClass
        ? [
            {
              provide: useClass,
              useClass,
            },
          ]
        : []),
    ];
  }

  private static buildRedisUrl(options: AdvancedCacheModuleOptions): string {
    const auth = options.password ? `:${encodeURIComponent(options.password)}@` : '';

    return `redis://${auth}${options.host}:${options.port}/${options.db ?? 0}`;
  }
}
