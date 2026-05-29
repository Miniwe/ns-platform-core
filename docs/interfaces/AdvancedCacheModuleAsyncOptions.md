[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AdvancedCacheModuleAsyncOptions

# Interface: AdvancedCacheModuleAsyncOptions

Defined in: [src/services/advanced-cache/types/advanced-cache.types.ts:21](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/types/advanced-cache.types.ts#L21)

## Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

## Properties

### inject?

> `optional` **inject?**: (`InjectionToken` \| `OptionalFactoryDependency`)[]

Defined in: [src/services/advanced-cache/types/advanced-cache.types.ts:28](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/types/advanced-cache.types.ts#L28)

***

### useClass?

> `optional` **useClass?**: `Type`\<[`AdvancedCacheOptionsFactory`](AdvancedCacheOptionsFactory.md)\>

Defined in: [src/services/advanced-cache/types/advanced-cache.types.ts:24](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/types/advanced-cache.types.ts#L24)

***

### useExisting?

> `optional` **useExisting?**: `Type`\<[`AdvancedCacheOptionsFactory`](AdvancedCacheOptionsFactory.md)\>

Defined in: [src/services/advanced-cache/types/advanced-cache.types.ts:23](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/types/advanced-cache.types.ts#L23)

***

### useFactory?

> `optional` **useFactory?**: (...`args`) => [`AdvancedCacheModuleOptions`](../type-aliases/AdvancedCacheModuleOptions.md) \| `Promise`\<[`AdvancedCacheModuleOptions`](../type-aliases/AdvancedCacheModuleOptions.md)\>

Defined in: [src/services/advanced-cache/types/advanced-cache.types.ts:25](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-cache/types/advanced-cache.types.ts#L25)

#### Parameters

##### args

...`unknown`[]

#### Returns

[`AdvancedCacheModuleOptions`](../type-aliases/AdvancedCacheModuleOptions.md) \| `Promise`\<[`AdvancedCacheModuleOptions`](../type-aliases/AdvancedCacheModuleOptions.md)\>
