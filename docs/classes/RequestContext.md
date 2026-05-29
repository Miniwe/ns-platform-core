[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RequestContext

# Class: RequestContext

Defined in: src/context/request-context.ts:5

## Constructors

### Constructor

> **new RequestContext**(): `RequestContext`

#### Returns

`RequestContext`

## Methods

### getRequestId()

> `static` **getRequestId**(): `string` \| `undefined`

Defined in: src/context/request-context.ts:23

#### Returns

`string` \| `undefined`

***

### getStore()

> `static` **getStore**(): `RequestContextStore` \| `undefined`

Defined in: src/context/request-context.ts:11

#### Returns

`RequestContextStore` \| `undefined`

***

### getUserId()

> `static` **getUserId**(): `number` \| `undefined`

Defined in: src/context/request-context.ts:19

#### Returns

`number` \| `undefined`

***

### run()

> `static` **run**\<`T`\>(`store`, `callback`): `T`

Defined in: src/context/request-context.ts:6

#### Type Parameters

##### T

`T`

#### Parameters

##### store

`RequestContextStore`

##### callback

() => `T`

#### Returns

`T`

***

### setPartial()

> `static` **setPartial**(`patch`): `void`

Defined in: src/context/request-context.ts:27

#### Parameters

##### patch

`Partial`\<`RequestContextStore`\>

#### Returns

`void`
