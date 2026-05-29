[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / BaseEntity

# Abstract Class: BaseEntity

Defined in: [src/database/domain/base.entity.ts:46](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L46)

Абстрактный базовый класс для всех сущностей системы с колонкой UpdatedAt
Обеспечивает наличие внутреннего числового ID для производительности
и публичного UUID для безопасности API[cite: 38].

## Extends

- [`BaseEntityNoUpdate`](BaseEntityNoUpdate.md)

## Implements

- [`BaseModelDto`](BaseModelDto.md)

## Constructors

### Constructor

> **new BaseEntity**(): `BaseEntity`

#### Returns

`BaseEntity`

#### Inherited from

[`BaseEntityNoUpdate`](BaseEntityNoUpdate.md).[`constructor`](BaseEntityNoUpdate.md#constructor)

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/database/domain/base.entity.ts:38](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L38)

Дата и время создания записи

#### Implementation of

[`BaseModelDto`](BaseModelDto.md).[`createdAt`](BaseModelDto.md#createdat)

#### Inherited from

[`BaseEntityNoUpdate`](BaseEntityNoUpdate.md).[`createdAt`](BaseEntityNoUpdate.md#createdat)

***

### id

> **id**: `number`

Defined in: [src/database/domain/base.entity.ts:20](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L20)

Внутренний первичный ключ (используется для связей и индексов в БД)

#### Implementation of

[`BaseModelDto`](BaseModelDto.md).[`id`](BaseModelDto.md#id)

#### Inherited from

[`BaseEntityNoUpdate`](BaseEntityNoUpdate.md).[`id`](BaseEntityNoUpdate.md#id)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/database/domain/base.entity.ts:56](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L56)

Дата и время последнего обновления записи

#### Implementation of

[`BaseModelDto`](BaseModelDto.md).[`updatedAt`](BaseModelDto.md#updatedat)

***

### uuid

> **uuid**: `string`

Defined in: [src/database/domain/base.entity.ts:28](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L28)

Публичный уникальный идентификатор.
Только это поле должно передаваться наружу во внешних API[cite: 65, 48].

#### Implementation of

[`BaseModelDto`](BaseModelDto.md).[`uuid`](BaseModelDto.md#uuid)

#### Inherited from

[`BaseEntityNoUpdate`](BaseEntityNoUpdate.md).[`uuid`](BaseEntityNoUpdate.md#uuid)
