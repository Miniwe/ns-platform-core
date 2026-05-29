[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RequestUserDto

# Class: RequestUserDto

Defined in: [src/auth/models/request-user.model.ts:4](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/models/request-user.model.ts#L4)

## Extends

- `object`

## Constructors

### Constructor

> **new RequestUserDto**(): `RequestUserDto`

Defined in: node\_modules/nestjs-zod/dist/dto-BwNEQwoy.d.cts:33

#### Returns

`RequestUserDto`

#### Inherited from

`createZodDto(RequestUserSchema).constructor`

## Properties

### id

> **id**: `number`

Defined in: [src/security/schemas/request-user.schema.ts:6](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/security/schemas/request-user.schema.ts#L6)

#### Inherited from

`createZodDto(RequestUserSchema).id`

***

### roles

> **roles**: `object`[]

Defined in: [src/security/schemas/request-user.schema.ts:8](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/security/schemas/request-user.schema.ts#L8)

#### description

> **description**: `string`

#### name

> **name**: `string` = `RoleNameSchema`

#### permissions

> **permissions**: `object`[]

#### Inherited from

`createZodDto(RequestUserSchema).roles`

***

### uuid

> **uuid**: `string`

Defined in: [src/security/schemas/request-user.schema.ts:7](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/security/schemas/request-user.schema.ts#L7)

#### Inherited from

`createZodDto(RequestUserSchema).uuid`
