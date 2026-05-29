[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / BaseService

# Abstract Class: BaseService\<T\>

Defined in: src/services/base.service/base.service.ts:37

Контракт для сервисов, поддерживающих конвертацию внешнего UUID во внутренний ID

## Type Parameters

### T

`T` *extends* `ObjectLiteral`

## Implements

- [`IResourceResolver`](../interfaces/IResourceResolver.md)

## Constructors

### Constructor

> **new BaseService**\<`T`\>(`errorHandling?`): `BaseService`\<`T`\>

Defined in: src/services/base.service/base.service.ts:43

#### Parameters

##### errorHandling?

[`ErrorHandlingService`](ErrorHandlingService.md)

#### Returns

`BaseService`\<`T`\>

## Methods

### count()

> **count**(`options?`): `Promise`\<`number`\>

Defined in: src/services/base.service/base.service.ts:214

#### Parameters

##### options?

`FindManyOptions`\<`T`\>

#### Returns

`Promise`\<`number`\>

***

### create()

> **create**(`data`): `Promise`\<`T`\>

Defined in: src/services/base.service/base.service.ts:373

Создание новой сущности.

#### Parameters

##### data

`DeepPartial`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### createMany()

> **createMany**(`dataArray`): `Promise`\<`T`[]\>

Defined in: src/services/base.service/base.service.ts:248

#### Parameters

##### dataArray

`DeepPartial`\<`T`\>[]

#### Returns

`Promise`\<`T`[]\>

***

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: src/services/base.service/base.service.ts:431

Удаление сущности через manager.

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`void`\>

***

### exists()

> **exists**(`id`): `Promise`\<`boolean`\>

Defined in: src/services/base.service/base.service.ts:203

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`boolean`\>

***

### findAll()

> **findAll**(`options?`): `Promise`\<`T`[]\>

Defined in: src/services/base.service/base.service.ts:146

#### Parameters

##### options?

`FindManyOptions`\<`T`\>

#### Returns

`Promise`\<`T`[]\>

***

### findByExternalId()

> **findByExternalId**(`uuid`, `relations?`): `Promise`\<`T`\>

Defined in: src/services/base.service/base.service.ts:90

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

Defined in: src/services/base.service/base.service.ts:329

Поиск сущности по числовому ID.

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`T` \| `null`\>

***

### findByIdOrFail()

> **findByIdOrFail**(`id`): `Promise`\<`T`\>

Defined in: src/services/base.service/base.service.ts:338

Поиск сущности по ID с выбросом исключения, если не найдена.

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`T`\>

***

### findByUuid()

> **findByUuid**(`uuid`): `Promise`\<`T` \| `null`\>

Defined in: src/services/base.service/base.service.ts:351

Поиск сущности по UUID.

#### Parameters

##### uuid

`string`

#### Returns

`Promise`\<`T` \| `null`\>

***

### findByUuidOrFail()

> **findByUuidOrFail**(`uuid`): `Promise`\<`T`\>

Defined in: src/services/base.service/base.service.ts:360

Поиск сущности по UUID с гарантированным результатом.

#### Parameters

##### uuid

`string`

#### Returns

`Promise`\<`T`\>

***

### findOne()

> **findOne**(`id`, `relations?`): `Promise`\<`T`\>

Defined in: src/services/base.service/base.service.ts:163

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

Defined in: src/services/base.service/base.service.ts:223

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

Defined in: src/services/base.service/base.service.ts:105

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`Error` \| `T`\>

***

### loadManyByIds()

> **loadManyByIds**(`ids`): `Promise`\<(`Error` \| `T`)[]\>

Defined in: src/services/base.service/base.service.ts:109

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`\<(`Error` \| `T`)[]\>

***

### remove()

> **remove**(`id`): `Promise`\<`void`\>

Defined in: src/services/base.service/base.service.ts:188

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`void`\>

***

### removeMany()

> **removeMany**(`ids`): `Promise`\<`number`\>

Defined in: src/services/base.service/base.service.ts:290

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`\<`number`\>

***

### resolveInternalId()

> **resolveInternalId**(`uuid`): `Promise`\<`number` \| `null`\>

Defined in: src/services/base.service/base.service.ts:73

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

Defined in: src/services/base.service/base.service.ts:311

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`void`\>

***

### update()

> **update**(`id`, `data`): `Promise`\<`T`\>

Defined in: src/services/base.service/base.service.ts:399

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

Defined in: src/services/base.service/base.service.ts:269

#### Parameters

##### ids

`number`[]

##### data

`QueryDeepPartialEntity`\<`T`\>

#### Returns

`Promise`\<`number`\>
