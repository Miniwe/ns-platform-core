[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / BaseService

# Abstract Class: BaseService\<T\>

Defined in: [src/services/base.service/base.service.ts:35](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L35)

Контракт для сервисов, поддерживающих конвертацию внешнего UUID во внутренний ID

## Type Parameters

### T

`T` *extends* `ObjectLiteral`

## Implements

- [`IResourceResolver`](../interfaces/IResourceResolver.md)

## Constructors

### Constructor

> **new BaseService**\<`T`\>(`errorHandling?`): `BaseService`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:41](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L41)

#### Parameters

##### errorHandling?

[`ErrorHandlingService`](ErrorHandlingService.md)

#### Returns

`BaseService`\<`T`\>

## Methods

### count()

> **count**(`options?`): `Promise`\<`number`\>

Defined in: [src/services/base.service/base.service.ts:212](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L212)

#### Parameters

##### options?

`FindManyOptions`\<`T`\>

#### Returns

`Promise`\<`number`\>

***

### create()

> **create**(`data`): `Promise`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:371](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L371)

Создание новой сущности.

#### Parameters

##### data

`DeepPartial`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### createMany()

> **createMany**(`dataArray`): `Promise`\<`T`[]\>

Defined in: [src/services/base.service/base.service.ts:246](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L246)

#### Parameters

##### dataArray

`DeepPartial`\<`T`\>[]

#### Returns

`Promise`\<`T`[]\>

***

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: [src/services/base.service/base.service.ts:429](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L429)

Удаление сущности через manager.

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`void`\>

***

### exists()

> **exists**(`id`): `Promise`\<`boolean`\>

Defined in: [src/services/base.service/base.service.ts:201](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L201)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`boolean`\>

***

### findAll()

> **findAll**(`options?`): `Promise`\<`T`[]\>

Defined in: [src/services/base.service/base.service.ts:144](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L144)

#### Parameters

##### options?

`FindManyOptions`\<`T`\>

#### Returns

`Promise`\<`T`[]\>

***

### findByExternalId()

> **findByExternalId**(`uuid`, `relations?`): `Promise`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:88](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L88)

Поиск сущности по внешнему UUID.

#### Parameters

##### uuid

`string`

##### relations?

`string`[]

#### Returns

`Promise`\<`T`\>

***

### findById()

> **findById**(`id`): `Promise`\<`T` \| `null`\>

Defined in: [src/services/base.service/base.service.ts:327](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L327)

Поиск сущности по числовому ID.

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`T` \| `null`\>

***

### findByIdOrFail()

> **findByIdOrFail**(`id`): `Promise`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:336](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L336)

Поиск сущности по ID с выбросом исключения, если не найдена.

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`T`\>

***

### findByUuid()

> **findByUuid**(`uuid`): `Promise`\<`T` \| `null`\>

Defined in: [src/services/base.service/base.service.ts:349](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L349)

Поиск сущности по UUID.

#### Parameters

##### uuid

`string`

#### Returns

`Promise`\<`T` \| `null`\>

***

### findByUuidOrFail()

> **findByUuidOrFail**(`uuid`): `Promise`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:358](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L358)

Поиск сущности по UUID с гарантированным результатом.

#### Parameters

##### uuid

`string`

#### Returns

`Promise`\<`T`\>

***

### findOne()

> **findOne**(`id`, `relations?`): `Promise`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:161](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L161)

#### Parameters

##### id

`number`

##### relations?

`string`[]

#### Returns

`Promise`\<`T`\>

***

### findWithPagination()

> **findWithPagination**(`page`, `limit`, `options?`): `Promise`\<\{ `data`: `T`[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

Defined in: [src/services/base.service/base.service.ts:221](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L221)

#### Parameters

##### page

`number`

##### limit

`number`

##### options?

`FindManyOptions`\<`T`\>

#### Returns

`Promise`\<\{ `data`: `T`[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

***

### loadById()

> **loadById**(`id`): `Promise`\<`Error` \| `T`\>

Defined in: [src/services/base.service/base.service.ts:103](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L103)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`Error` \| `T`\>

***

### loadManyByIds()

> **loadManyByIds**(`ids`): `Promise`\<(`Error` \| `T`)[]\>

Defined in: [src/services/base.service/base.service.ts:107](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L107)

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`\<(`Error` \| `T`)[]\>

***

### remove()

> **remove**(`id`): `Promise`\<`void`\>

Defined in: [src/services/base.service/base.service.ts:186](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L186)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`void`\>

***

### removeMany()

> **removeMany**(`ids`): `Promise`\<`number`\>

Defined in: [src/services/base.service/base.service.ts:288](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L288)

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`\<`number`\>

***

### resolveInternalId()

> **resolveInternalId**(`uuid`): `Promise`\<`number` \| `null`\>

Defined in: [src/services/base.service/base.service.ts:71](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L71)

КРИТИЧЕСКИЙ МЕТОД: Преобразование UUID во внутренний числовой ID для guards.

#### Parameters

##### uuid

`string`

#### Returns

`Promise`\<`number` \| `null`\>

#### Implementation of

[`IResourceResolver`](../interfaces/IResourceResolver.md).[`resolveInternalId`](../interfaces/IResourceResolver.md#resolveinternalid)

***

### softDelete()

> **softDelete**(`id`): `Promise`\<`void`\>

Defined in: [src/services/base.service/base.service.ts:309](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L309)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`void`\>

***

### update()

> **update**(`id`, `data`): `Promise`\<`T`\>

Defined in: [src/services/base.service/base.service.ts:397](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L397)

Обновление существующей сущности.

#### Parameters

##### id

`number`

##### data

`QueryDeepPartialEntity`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### updateMany()

> **updateMany**(`ids`, `data`): `Promise`\<`number`\>

Defined in: [src/services/base.service/base.service.ts:267](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L267)

#### Parameters

##### ids

`number`[]

##### data

`QueryDeepPartialEntity`\<`T`\>

#### Returns

`Promise`\<`number`\>
