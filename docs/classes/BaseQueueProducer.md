[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / BaseQueueProducer

# Abstract Class: BaseQueueProducer\<T\>

Defined in: [src/queues/base-queue.producer.ts:3](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/queues/base-queue.producer.ts#L3)

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

> **new BaseQueueProducer**\<`T`\>(`queue`): `BaseQueueProducer`\<`T`\>

Defined in: [src/queues/base-queue.producer.ts:4](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/queues/base-queue.producer.ts#L4)

#### Parameters

##### queue

`Queue`

#### Returns

`BaseQueueProducer`\<`T`\>

## Methods

### addJob()

> **addJob**(`name`, `data`, `opts?`): `Promise`\<`Job`\<`any`, `any`, `string`\>\>

Defined in: [src/queues/base-queue.producer.ts:6](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/queues/base-queue.producer.ts#L6)

#### Parameters

##### name

`string`

##### data

`T`

##### opts?

`any`

#### Returns

`Promise`\<`Job`\<`any`, `any`, `string`\>\>
