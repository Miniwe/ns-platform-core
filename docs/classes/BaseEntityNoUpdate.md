[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / BaseEntityNoUpdate

# Abstract Class: BaseEntityNoUpdate

Defined in: [src/database/domain/base.entity.ts:15](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L15)

Абстрактный базовый класс для всех сущностей системы.
Обеспечивает наличие внутреннего числового ID для производительности
и публичного UUID для безопасности API[cite: 38].

## Extended by

- [`BaseEntity`](BaseEntity.md)

## Implements

- [`BaseModelNoUpadteDto`](BaseModelNoUpadteDto.md)

## Constructors

### Constructor

> **new BaseEntityNoUpdate**(): `BaseEntityNoUpdate`

#### Returns

`BaseEntityNoUpdate`

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/database/domain/base.entity.ts:38](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L38)

Дата и время создания записи

#### Implementation of

[`BaseModelNoUpadteDto`](BaseModelNoUpadteDto.md).[`createdAt`](BaseModelNoUpadteDto.md#createdat)

***

### id

> **id**: `number`

Defined in: [src/database/domain/base.entity.ts:20](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L20)

Внутренний первичный ключ (используется для связей и индексов в БД)

#### Implementation of

[`BaseModelNoUpadteDto`](BaseModelNoUpadteDto.md).[`id`](BaseModelNoUpadteDto.md#id)

***

### uuid

> **uuid**: `string`

Defined in: [src/database/domain/base.entity.ts:28](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/database/domain/base.entity.ts#L28)

Публичный уникальный идентификатор.
Только это поле должно передаваться наружу во внешних API[cite: 65, 48].

#### Implementation of

[`BaseModelNoUpadteDto`](BaseModelNoUpadteDto.md).[`uuid`](BaseModelNoUpadteDto.md#uuid)
