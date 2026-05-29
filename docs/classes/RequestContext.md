[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RequestContext

# Class: RequestContext

Defined in: [src/context/request-context.ts:5](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.ts#L5)

## Constructors

### Constructor

> **new RequestContext**(): `RequestContext`

#### Returns

`RequestContext`

## Methods

### getRequestId()

> `static` **getRequestId**(): `string` \| `undefined`

Defined in: [src/context/request-context.ts:23](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.ts#L23)

#### Returns

`string` \| `undefined`

***

### getStore()

> `static` **getStore**(): `RequestContextStore` \| `undefined`

Defined in: [src/context/request-context.ts:11](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.ts#L11)

#### Returns

`RequestContextStore` \| `undefined`

***

### getUserId()

> `static` **getUserId**(): `number` \| `undefined`

Defined in: [src/context/request-context.ts:19](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.ts#L19)

#### Returns

`number` \| `undefined`

***

### run()

> `static` **run**\<`T`\>(`store`, `callback`): `T`

Defined in: [src/context/request-context.ts:6](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.ts#L6)

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

Defined in: [src/context/request-context.ts:27](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.ts#L27)

#### Parameters

##### patch

`Partial`\<`RequestContextStore`\>

#### Returns

`void`
