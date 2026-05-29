[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AdvancedCacheService

# Class: AdvancedCacheService

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:11](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L11)

## Implements

- `OnModuleDestroy`

## Constructors

### Constructor

> **new AdvancedCacheService**(`cacheManager`, `redis`, `errorHandlingService`): `AdvancedCacheService`

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:14](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L14)

#### Parameters

##### cacheManager

`Cache`

##### redis

`Redis`

##### errorHandlingService

[`ErrorHandlingService`](ErrorHandlingService.md)

#### Returns

`AdvancedCacheService`

## Methods

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:62](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L62)

Удаление ключа из кэша.
Не выбрасывает исключения — фейл кэша не должен ломать бизнес-логику.

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### expire()

> **expire**(`key`, `seconds`): `Promise`\<`void`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:154](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L154)

#### Parameters

##### key

`string`

##### seconds

`number`

#### Returns

`Promise`\<`void`\>

***

### flushAll()

> **flushAll**(): `Promise`\<`void`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:162](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L162)

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T` \| `undefined`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:20](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L20)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### getWithFallback()

> **getWithFallback**\<`T`\>(`key`, `fallback`, `options?`): `Promise`\<`T`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:166](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L166)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### fallback

() => `Promise`\<`T`\>

##### options?

###### refreshTtl

`boolean` \| `null` = `...`

###### tags?

(`string` \| `symbol`)[] = `...`

###### ttl

`number` = `...`

###### version?

`string` \| `null` = `...`

#### Returns

`Promise`\<`T`\>

***

### incr()

> **incr**(`key`): `Promise`\<`number`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:150](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L150)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### invalidateTag()

> **invalidateTag**(`tag`): `Promise`\<`number`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:74](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L74)

#### Parameters

##### tag

`string`

#### Returns

`Promise`\<`number`\>

***

### invalidateTags()

> **invalidateTags**(`tags`): `Promise`\<`number`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:102](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L102)

Инвалидация всех ключей с указанным тегом.

#### Parameters

##### tags

`string`[]

#### Returns

`Promise`\<`number`\>

***

### onModuleDestroy()

> **onModuleDestroy**(): `Promise`\<`void`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:142](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L142)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

***

### ping()

> **ping**(): `Promise`\<`boolean`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:130](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L130)

#### Returns

`Promise`\<`boolean`\>

***

### set()

> **set**\<`T`\>(`key`, `value`, `options?`): `Promise`\<`void`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:33](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L33)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### value

`T`

##### options?

###### refreshTtl

`boolean` \| `null` = `...`

###### tags?

(`string` \| `symbol`)[] = `...`

###### ttl

`number` = `...`

###### version?

`string` \| `null` = `...`

#### Returns

`Promise`\<`void`\>

***

### ttl()

> **ttl**(`key`): `Promise`\<`number`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:158](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L158)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### wrap()

> **wrap**\<`T`\>(`key`, `factory`, `options?`): `Promise`\<`T`\>

Defined in: [src/services/advanced-cache/advanced-cache.service.ts:118](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/advanced-cache.service.ts#L118)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### factory

() => `Promise`\<`T`\>

##### options?

###### refreshTtl

`boolean` \| `null` = `...`

###### tags?

(`string` \| `symbol`)[] = `...`

###### ttl

`number` = `...`

###### version?

`string` \| `null` = `...`

#### Returns

`Promise`\<`T`\>
