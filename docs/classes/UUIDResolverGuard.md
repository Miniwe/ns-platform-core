[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / UUIDResolverGuard

# Class: UUIDResolverGuard

Defined in: [src/guards/uuid-resolver.guard.ts:7](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/guards/uuid-resolver.guard.ts#L7)

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new UUIDResolverGuard**(`reflector`, `moduleRef`): `UUIDResolverGuard`

Defined in: [src/guards/uuid-resolver.guard.ts:8](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/guards/uuid-resolver.guard.ts#L8)

#### Parameters

##### reflector

`Reflector`

##### moduleRef

`ModuleRef`

#### Returns

`UUIDResolverGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `Promise`\<`boolean`\>

Defined in: [src/guards/uuid-resolver.guard.ts:13](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/guards/uuid-resolver.guard.ts#L13)

#### Parameters

##### context

`ExecutionContext`

Current execution context. Provides access to details about
the current request pipeline.

#### Returns

`Promise`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

#### Implementation of

`CanActivate.canActivate`
