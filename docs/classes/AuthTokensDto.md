[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AuthTokensDto

# Class: AuthTokensDto

Defined in: [src/auth/models/auth-session.model.ts:4](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/models/auth-session.model.ts#L4)

## Extends

- `object`

## Constructors

### Constructor

> **new AuthTokensDto**(): `AuthTokensDto`

Defined in: node\_modules/nestjs-zod/dist/dto-BwNEQwoy.d.cts:33

#### Returns

`AuthTokensDto`

#### Inherited from

`createZodDto(AuthTokensSchema).constructor`

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [src/auth/schemas/auth-session.schema.ts:5](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L5)

#### Inherited from

`createZodDto(AuthTokensSchema).accessToken`

***

### expiresIn

> **expiresIn**: `number`

Defined in: [src/auth/schemas/auth-session.schema.ts:8](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L8)

#### Inherited from

`createZodDto(AuthTokensSchema).expiresIn`

***

### refreshExpiresIn?

> `optional` **refreshExpiresIn?**: `number`

Defined in: [src/auth/schemas/auth-session.schema.ts:9](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L9)

#### Inherited from

`createZodDto(AuthTokensSchema).refreshExpiresIn`

***

### refreshToken?

> `optional` **refreshToken?**: `string`

Defined in: [src/auth/schemas/auth-session.schema.ts:6](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L6)

#### Inherited from

`createZodDto(AuthTokensSchema).refreshToken`

***

### tokenType

> **tokenType**: `"Bearer"`

Defined in: [src/auth/schemas/auth-session.schema.ts:7](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L7)

#### Inherited from

`createZodDto(AuthTokensSchema).tokenType`
