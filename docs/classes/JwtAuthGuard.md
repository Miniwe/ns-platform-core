[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / JwtAuthGuard

# Class: JwtAuthGuard

Defined in: [src/auth/guards/jwt-auth.guard.ts:11](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/guards/jwt-auth.guard.ts#L11)

## Extends

- `IAuthGuard`

## Constructors

### Constructor

> **new JwtAuthGuard**(`reflector`): `JwtAuthGuard`

Defined in: [src/auth/guards/jwt-auth.guard.ts:12](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/guards/jwt-auth.guard.ts#L12)

#### Parameters

##### reflector

`Reflector`

#### Returns

`JwtAuthGuard`

#### Overrides

`AuthGuard('jwt').constructor`

## Methods

### canActivate()

> **canActivate**(`context`): `boolean` \| `Promise`\<`boolean`\> \| `Observable`\<`boolean`\>

Defined in: [src/auth/guards/jwt-auth.guard.ts:16](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/guards/jwt-auth.guard.ts#L16)

#### Parameters

##### context

`ExecutionContext`

Current execution context. Provides access to details about
the current request pipeline.

#### Returns

`boolean` \| `Promise`\<`boolean`\> \| `Observable`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

#### Overrides

`AuthGuard('jwt').canActivate`

***

### handleRequest()

> **handleRequest**\<`TUser`\>(`err`, `user`): `TUser`

Defined in: [src/auth/guards/jwt-auth.guard.ts:29](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/guards/jwt-auth.guard.ts#L29)

#### Type Parameters

##### TUser

`TUser`

#### Parameters

##### err

`Error` \| `null`

##### user

`TUser` \| `null`

#### Returns

`TUser`

#### Overrides

`AuthGuard('jwt').handleRequest`
