[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RateLimitConfigSchema

# Variable: RateLimitConfigSchema

> `const` **RateLimitConfigSchema**: `ZodObject`\<\{ `keyGenerator`: `ZodOptional`\<`ZodCustom`\<(`req`) => `string`, (`req`) => `string`\>\>; `max`: `ZodNumber`; `message`: `ZodString`; `skipFailedRequest`: `ZodOptional`\<`ZodBoolean`\>; `skipSuccessfulRequest`: `ZodOptional`\<`ZodBoolean`\>; `windowMs`: `ZodNumber`; \}, `$strip`\>

Defined in: src/services/advanced-throttle/domain/advanced-throttle.schema.ts:10

Zod schema для runtime-валидации конфига @RateLimit().
z.function() не сериализуется через metadata — keyGenerator
передаётся as-is, валидируется только на уровне типов TS.
