[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AuthSessionDto

# Class: AuthSessionDto

Defined in: [src/auth/models/auth-session.model.ts:5](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/models/auth-session.model.ts#L5)

## Extends

- `object`

## Constructors

### Constructor

> **new AuthSessionDto**(): `AuthSessionDto`

Defined in: node\_modules/nestjs-zod/dist/dto-BwNEQwoy.d.cts:33

#### Returns

`AuthSessionDto`

#### Inherited from

`createZodDto(AuthSessionSchema).constructor`

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [src/auth/schemas/auth-session.schema.ts:5](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L5)

#### Inherited from

`createZodDto(AuthSessionSchema).accessToken`

***

### expiresIn

> **expiresIn**: `number`

Defined in: [src/auth/schemas/auth-session.schema.ts:8](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L8)

#### Inherited from

`createZodDto(AuthSessionSchema).expiresIn`

***

### refreshExpiresIn?

> `optional` **refreshExpiresIn?**: `number`

Defined in: [src/auth/schemas/auth-session.schema.ts:9](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L9)

#### Inherited from

`createZodDto(AuthSessionSchema).refreshExpiresIn`

***

### refreshToken?

> `optional` **refreshToken?**: `string`

Defined in: [src/auth/schemas/auth-session.schema.ts:6](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L6)

#### Inherited from

`createZodDto(AuthSessionSchema).refreshToken`

***

### tokenType

> **tokenType**: `"Bearer"`

Defined in: [src/auth/schemas/auth-session.schema.ts:7](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L7)

#### Inherited from

`createZodDto(AuthSessionSchema).tokenType`

***

### user

> **user**: `object`

Defined in: [src/auth/schemas/auth-session.schema.ts:18](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L18)

#### id

> **id**: `number`

#### roles

> **roles**: `object`[]

#### uuid

> **uuid**: `string`

#### Inherited from

`createZodDto(AuthSessionSchema).user`
