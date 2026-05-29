[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / TransactionContext

# Class: TransactionContext

Defined in: [src/services/transaction/transaction-context.service.ts:4](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/services/transaction/transaction-context.service.ts#L4)

## Constructors

### Constructor

> **new TransactionContext**(): `TransactionContext`

#### Returns

`TransactionContext`

## Methods

### getManager()

> `static` **getManager**(): `EntityManager`

Defined in: [src/services/transaction/transaction-context.service.ts:15](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/services/transaction/transaction-context.service.ts#L15)

#### Returns

`EntityManager`

***

### hasActiveTransaction()

> `static` **hasActiveTransaction**(): `boolean`

Defined in: [src/services/transaction/transaction-context.service.ts:11](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/services/transaction/transaction-context.service.ts#L11)

#### Returns

`boolean`

***

### run()

> `static` **run**\<`T`\>(`manager`, `fn`): `Promise`\<`T`\>

Defined in: [src/services/transaction/transaction-context.service.ts:31](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/services/transaction/transaction-context.service.ts#L31)

#### Type Parameters

##### T

`T`

#### Parameters

##### manager

`EntityManager`

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### setFallbackManager()

> `static` **setFallbackManager**(`manager`): `void`

Defined in: [src/services/transaction/transaction-context.service.ts:7](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/services/transaction/transaction-context.service.ts#L7)

#### Parameters

##### manager

`EntityManager`

#### Returns

`void`
