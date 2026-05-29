**@miniwe/ns-platform-core**

***

# @miniwe/ns-platform-core

## Classes

- [AdvancedCacheModule](classes/AdvancedCacheModule.md)
- [AdvancedCacheService](classes/AdvancedCacheService.md)
- [AdvancedThrottleGuard](classes/AdvancedThrottleGuard.md)
- [AdvancedThrottleModule](classes/AdvancedThrottleModule.md)
- [AllExceptionsFilter](classes/AllExceptionsFilter.md)
- [AppContext](classes/AppContext.md)
- [AuthSessionDto](classes/AuthSessionDto.md)
- [AuthTokensDto](classes/AuthTokensDto.md)
- [BaseEntity](classes/BaseEntity.md)
- [BaseEntityNoUpdate](classes/BaseEntityNoUpdate.md)
- [BaseModelDto](classes/BaseModelDto.md)
- [BaseModelNoUpadteDto](classes/BaseModelNoUpadteDto.md)
- [BaseQueueProducer](classes/BaseQueueProducer.md)
- [BaseQueueWorker](classes/BaseQueueWorker.md)
- [BaseService](classes/BaseService.md)
- [ColumnDateTransformer](classes/ColumnDateTransformer.md)
- [ColumnNumericTransformer](classes/ColumnNumericTransformer.md)
- [CriticalOperationGuard](classes/CriticalOperationGuard.md)
- [ErrorHandlingModule](classes/ErrorHandlingModule.md)
- [ErrorHandlingService](classes/ErrorHandlingService.md)
- [JwtAuthGuard](classes/JwtAuthGuard.md)
- [JwtPayloadDto](classes/JwtPayloadDto.md)
- [LibConfigService](classes/LibConfigService.md)
- [MetadataExplorerService](classes/MetadataExplorerService.md)
- [MoneyMath](classes/MoneyMath.md)
- [RequestContext](classes/RequestContext.md)
- [RequestContextInterceptor](classes/RequestContextInterceptor.md)
- [RequestUserDto](classes/RequestUserDto.md)
- [TransactionContext](classes/TransactionContext.md)
- [UUIDResolverGuard](classes/UUIDResolverGuard.md)

## Interfaces

- [AdvancedCacheModuleAsyncOptions](interfaces/AdvancedCacheModuleAsyncOptions.md)
- [AdvancedCacheOptionsFactory](interfaces/AdvancedCacheOptionsFactory.md)
- [BaseServiceOptions](interfaces/BaseServiceOptions.md)
- [IResourceResolver](interfaces/IResourceResolver.md)
- [ThrottleModuleOptions](interfaces/ThrottleModuleOptions.md)

## Type Aliases

- [AdvancedCacheModuleOptions](type-aliases/AdvancedCacheModuleOptions.md)
- [AuthSession](type-aliases/AuthSession.md)
- [AuthTokens](type-aliases/AuthTokens.md)
- [BaseEnvConfig](type-aliases/BaseEnvConfig.md)
- [CacheOptions](type-aliases/CacheOptions.md)
- [ErrorContext](type-aliases/ErrorContext.md)
- [JwtPayload](type-aliases/JwtPayload.md)
- [NestModuleImport](type-aliases/NestModuleImport.md)
- [OmitDto](type-aliases/OmitDto.md)
- [OverrideOptionalDto](type-aliases/OverrideOptionalDto.md)
- [OverrideRequiredDto](type-aliases/OverrideRequiredDto.md)
- [PartialDto](type-aliases/PartialDto.md)
- [PostgresEnvConfig](type-aliases/PostgresEnvConfig.md)
- [PostgresRuntimeConfig](type-aliases/PostgresRuntimeConfig.md)
- [RateLimitConfig](type-aliases/RateLimitConfig.md)
- [RedisEnvConfig](type-aliases/RedisEnvConfig.md)
- [RequiredDto](type-aliases/RequiredDto.md)
- [ThrottleModuleAsyncOptions](type-aliases/ThrottleModuleAsyncOptions.md)
- [TypeOrmBuildOptions](type-aliases/TypeOrmBuildOptions.md)

## Variables

- [ADVANCED\_CACHE\_OPTIONS](variables/ADVANCED_CACHE_OPTIONS.md)
- [AuthSessionSchema](variables/AuthSessionSchema.md)
- [AuthTokensSchema](variables/AuthTokensSchema.md)
- [baseEnvSchema](variables/baseEnvSchema.md)
- [BaseNoUpadteSchema](variables/BaseNoUpadteSchema.md)
- [BaseSchema](variables/BaseSchema.md)
- [CacheOptionsSchema](variables/CacheOptionsSchema.md)
- [CurrentUser](variables/CurrentUser.md)
- [DecimalSchema](variables/DecimalSchema.md)
- [DecimalSchemaDto](variables/DecimalSchemaDto.md)
- [DecimalTransportSchema](variables/DecimalTransportSchema.md)
- [ErrorContextSchema](variables/ErrorContextSchema.md)
- [IS\_PUBLIC\_KEY](variables/IS_PUBLIC_KEY.md)
- [JwtPayloadSchema](variables/JwtPayloadSchema.md)
- [postgresEnvSchema](variables/postgresEnvSchema.md)
- [RateLimitConfigSchema](variables/RateLimitConfigSchema.md)
- [REDIS\_CLIENT](variables/REDIS_CLIENT.md)
- [RedisEnvSchema](variables/RedisEnvSchema.md)
- [RESOLVE\_RESOURCE\_KEY](variables/RESOLVE_RESOURCE_KEY.md)
- [THROTTLE\_MODULE\_OPTIONS](variables/THROTTLE_MODULE_OPTIONS.md)

## Functions

- [buildPostgresTypeOrmConfig](functions/buildPostgresTypeOrmConfig.md)
- [createValidateFn](functions/createValidateFn.md)
- [currentUserFactory](functions/currentUserFactory.md)
- [HasFieldsGuard](functions/HasFieldsGuard.md)
- [parseRateLimitConfig](functions/parseRateLimitConfig.md)
- [Public](functions/Public.md)
- [RateLimit](functions/RateLimit.md)
- [ResolveResource](functions/ResolveResource.md)
- [toDecimal](functions/toDecimal.md)
