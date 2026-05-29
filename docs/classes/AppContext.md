[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AppContext

# Class: AppContext

Defined in: src/context/app.context.ts:14

## Constructors

### Constructor

> **new AppContext**(): `AppContext`

#### Returns

`AppContext`

## Methods

### getStore()

> `static` **getStore**(): `AppContextStore` \| `undefined`

Defined in: src/context/app.context.ts:21

#### Returns

`AppContextStore` \| `undefined`

***

### run()

> `static` **run**\<`T`\>(`store`, `callback`): `T`

Defined in: src/context/app.context.ts:17

#### Type Parameters

##### T

`T`

#### Parameters

##### store

`AppContextStore`

##### callback

() => `T`

#### Returns

`T`

***

### setPartial()

> `static` **setPartial**(`patch`): `void`

Defined in: src/context/app.context.ts:25

#### Parameters

##### patch

`Partial`\<`AppContextStore`\>

#### Returns

`void`
