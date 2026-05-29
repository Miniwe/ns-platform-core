[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AdvancedThrottleGuard

# Class: AdvancedThrottleGuard

Defined in: [src/services/advanced-throttle/advanced-throttle.guard.ts:31](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-throttle/advanced-throttle.guard.ts#L31)

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new AdvancedThrottleGuard**(`reflector`, `cacheService`, `options?`): `AdvancedThrottleGuard`

Defined in: [src/services/advanced-throttle/advanced-throttle.guard.ts:35](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-throttle/advanced-throttle.guard.ts#L35)

#### Parameters

##### reflector

`Reflector`

##### cacheService

[`AdvancedCacheService`](AdvancedCacheService.md)

##### options?

[`ThrottleModuleOptions`](../interfaces/ThrottleModuleOptions.md) = `{}`

#### Returns

`AdvancedThrottleGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `Promise`\<`boolean`\>

Defined in: [src/services/advanced-throttle/advanced-throttle.guard.ts:52](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-throttle/advanced-throttle.guard.ts#L52)

Main entry point for NestJS guard pipeline.

Checks and increments the current counter for a specific key (user/IP/route),
enforces HttpRequestLike limits, and sets appropriate response headers.

#### Parameters

##### context

`ExecutionContext`

NestJS HttpRequestLike execution context.

#### Returns

`Promise`\<`boolean`\>

True if HttpRequestLike is allowed, otherwise throws an exception.

#### Throws

`429 Too Many Request` when the defined limit is exceeded.

#### Implementation of

`CanActivate.canActivate`
