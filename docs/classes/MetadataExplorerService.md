[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / MetadataExplorerService

# Class: MetadataExplorerService

Defined in: src/services/metadata-explorer/metadata-explorer.service.ts:12

## Constructors

### Constructor

> **new MetadataExplorerService**(`discoveryService`, `cacheService`): `MetadataExplorerService`

Defined in: src/services/metadata-explorer/metadata-explorer.service.ts:13

#### Parameters

##### discoveryService

`DiscoveryService`

##### cacheService

[`AdvancedCacheService`](AdvancedCacheService.md)

#### Returns

`MetadataExplorerService`

## Methods

### findAllMetadata()

> **findAllMetadata**(`key`): `AppPermissionsType`

Defined in: src/services/metadata-explorer/metadata-explorer.service.ts:18

#### Parameters

##### key

`string` \| `symbol`

#### Returns

`AppPermissionsType`

***

### getAllPermissions()

> **getAllPermissions**(): `Promise`\<`object`[]\>

Defined in: src/services/metadata-explorer/metadata-explorer.service.ts:42

#### Returns

`Promise`\<`object`[]\>
