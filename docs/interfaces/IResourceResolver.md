[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / IResourceResolver

# Interface: IResourceResolver

Defined in: [src/services/base.service/base.service.ts:25](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L25)

Контракт для сервисов, поддерживающих конвертацию внешнего UUID во внутренний ID

## Methods

### resolveInternalId()

> **resolveInternalId**(`uuid`): `Promise`\<`number` \| `null`\>

Defined in: [src/services/base.service/base.service.ts:26](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/base.service/base.service.ts#L26)

#### Parameters

##### uuid

`string`

#### Returns

`Promise`\<`number` \| `null`\>
