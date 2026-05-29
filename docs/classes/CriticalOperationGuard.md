[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / CriticalOperationGuard

# Class: CriticalOperationGuard

Defined in: [src/guards/critical-operation.guard.ts:5](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/guards/critical-operation.guard.ts#L5)

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new CriticalOperationGuard**(`jwtService`): `CriticalOperationGuard`

Defined in: [src/guards/critical-operation.guard.ts:6](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/guards/critical-operation.guard.ts#L6)

#### Parameters

##### jwtService

`JwtService`

#### Returns

`CriticalOperationGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `boolean`

Defined in: [src/guards/critical-operation.guard.ts:8](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/guards/critical-operation.guard.ts#L8)

#### Parameters

##### context

`ExecutionContext`

Current execution context. Provides access to details about
the current request pipeline.

#### Returns

`boolean`

Value indicating whether or not the current request is allowed to
proceed.

#### Implementation of

`CanActivate.canActivate`
