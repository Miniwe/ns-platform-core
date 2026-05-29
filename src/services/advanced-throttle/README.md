app.module.ts — ПРАВИЛЬНОЕ использование из внешнего пакета

```typescript
@Module({
  imports: [
    // 1. Consumer регистрирует CacheModule со своими опциями
    AdvancedCacheModule.registerAsync({
      useFactory: (cfg: ConfigService) => ({
        store: redisStore,
        host: cfg.get('REDIS_HOST'),
        ttl: 60,
      }),
      inject: [ConfigService],
    }),

    // 2. ThrottleModule не знает про CacheModule — просто регистрируется
    AdvancedThrottleModule.register({}),
    // или: AdvancedThrottleModule.registerAsync({ useFactory: ... })
  ],
})
export class AppModule {}
```