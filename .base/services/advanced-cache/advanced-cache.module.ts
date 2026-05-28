import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import Redis from 'ioredis';

import { AdvancedCacheService } from './advanced-cache.service';
import { EnvConfig } from '@/common/config/env.validation';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService<EnvConfig, true>],
      useFactory: async (configService: ConfigService<EnvConfig, true>) => {
        const host = configService.get('REDIS_HOST', { infer: true });
        const port = configService.get('REDIS_PORT', { infer: true });
        const password = configService.get('REDIS_PASSWORD', { infer: true });
        const db = configService.get('REDIS_DB', { infer: true });

        const auth = password ? `:${encodeURIComponent(password)}@` : '';
        const redisUrl = `redis://${auth}${host}:${port}/${db}`;

        return {
          isGlobal: true,
          ttl: 60 * 60 * 1000,
          stores: [
            createKeyv(redisUrl, {
              namespace: 'goalscorer-cache',
            }),
          ],
        };
      },
    }),
  ],
  providers: [
    AdvancedCacheService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService<EnvConfig, true>],
      useFactory: (configService: ConfigService<EnvConfig, true>) =>
        new Redis({
          host: configService.get('REDIS_HOST', { infer: true }),
          port: configService.get('REDIS_PORT', { infer: true }),
          password: configService.get('REDIS_PASSWORD', { infer: true }),
          db: configService.get('REDIS_DB', { infer: true }),
          maxRetriesPerRequest: 2,
          enableReadyCheck: true,
          lazyConnect: false,
        }),
    },
  ],
  exports: [AdvancedCacheService, 'REDIS_CLIENT', CacheModule],
})
export class AdvancedCacheModule {}
