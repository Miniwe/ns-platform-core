[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / BaseQueueWorker

# Abstract Class: BaseQueueWorker\<T, R\>

Defined in: [src/queues/base-queue.worker.ts:10](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/queues/base-queue.worker.ts#L10)

Базовый класс для всех воркеров очередей.
T - тип данных задачи (Job Data), по умолчанию безопасный объект
R - тип возвращаемого результата

## Extends

- `WorkerHost`

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### R

`R` = `void`

## Constructors

### Constructor

> **new BaseQueueWorker**\<`T`, `R`\>(): `BaseQueueWorker`\<`T`, `R`\>

#### Returns

`BaseQueueWorker`\<`T`, `R`\>

#### Inherited from

`WorkerHost.constructor`

## Methods

### handle()

> `abstract` **handle**(`job`): `Promise`\<`R`\>

Defined in: [src/queues/base-queue.worker.ts:19](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/queues/base-queue.worker.ts#L19)

Основной метод бизнес-логики, который должны реализовать наследники.

#### Parameters

##### job

`Job`\<`T`\>

#### Returns

`Promise`\<`R`\>

***

### process()

> **process**(`job`, `_token?`): `Promise`\<`R`\>

Defined in: [src/queues/base-queue.worker.ts:26](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/queues/base-queue.worker.ts#L26)

Точка входа BullMQ.

#### Parameters

##### job

`Job`\<`T`\>

Объект задачи

##### \_token?

`string`

Токен владения (не используется, помечен для ESLint)

#### Returns

`Promise`\<`R`\>

#### Overrides

`WorkerHost.process`
