[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / ErrorHandlingService

# Class: ErrorHandlingService

Defined in: [src/services/error-handling/error-handling.service.ts:5](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/error-handling/error-handling.service.ts#L5)

## Constructors

### Constructor

> **new ErrorHandlingService**(): `ErrorHandlingService`

#### Returns

`ErrorHandlingService`

## Methods

### extractFromHost()

> **extractFromHost**(`host`): `object`

Defined in: [src/services/error-handling/error-handling.service.ts:66](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/error-handling/error-handling.service.ts#L66)

Извлечение данных из HTTP запроса для контекста

#### Parameters

##### host

`ArgumentsHost`

#### Returns

`object`

##### componentMethod?

> `optional` **componentMethod?**: `string`

##### data?

> `optional` **data?**: `any`

##### entityId?

> `optional` **entityId?**: `string` \| `number`

##### entityName?

> `optional` **entityName?**: `string`

##### ip?

> `optional` **ip?**: `string`

##### method?

> `optional` **method?**: `string`

##### module?

> `optional` **module?**: `string`

##### service?

> `optional` **service?**: `string`

##### stack?

> `optional` **stack?**: `string`

##### url?

> `optional` **url?**: `string`

##### userAgent?

> `optional` **userAgent?**: `string`

##### userId?

> `optional` **userId?**: `number`

***

### handleError()

> **handleError**(`error`, `context?`, `rethrow?`): `void`

Defined in: [src/services/error-handling/error-handling.service.ts:14](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/error-handling/error-handling.service.ts#L14)

Основной метод обработки ошибок.

#### Parameters

##### error

`any`

Объект ошибки

##### context?

Дополнительный контекст

###### componentMethod?

`string` = `...`

###### data?

`any` = `...`

###### entityId?

`string` \| `number` = `...`

###### entityName?

`string` = `...`

###### ip?

`string` = `...`

###### method?

`string` = `...`

###### module?

`string` = `...`

###### service?

`string` = `...`

###### stack?

`string` = `...`

###### url?

`string` = `...`

###### userAgent?

`string` = `...`

###### userId?

`number` = `...`

##### rethrow?

`boolean` = `true`

Нужно ли пробрасывать ошибку дальше (для фильтров)

#### Returns

`void`

***

### logInfo()

> **logInfo**(`message`, `context?`): `void`

Defined in: [src/services/error-handling/error-handling.service.ts:52](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/error-handling/error-handling.service.ts#L52)

#### Parameters

##### message

`string`

##### context?

###### componentMethod?

`string` = `...`

###### data?

`any` = `...`

###### entityId?

`string` \| `number` = `...`

###### entityName?

`string` = `...`

###### ip?

`string` = `...`

###### method?

`string` = `...`

###### module?

`string` = `...`

###### service?

`string` = `...`

###### stack?

`string` = `...`

###### url?

`string` = `...`

###### userAgent?

`string` = `...`

###### userId?

`number` = `...`

#### Returns

`void`

***

### logWarn()

> **logWarn**(`message`, `context?`): `void`

Defined in: [src/services/error-handling/error-handling.service.ts:41](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/error-handling/error-handling.service.ts#L41)

#### Parameters

##### message

`string`

##### context?

###### componentMethod?

`string` = `...`

###### data?

`any` = `...`

###### entityId?

`string` \| `number` = `...`

###### entityName?

`string` = `...`

###### ip?

`string` = `...`

###### method?

`string` = `...`

###### module?

`string` = `...`

###### service?

`string` = `...`

###### stack?

`string` = `...`

###### url?

`string` = `...`

###### userAgent?

`string` = `...`

###### userId?

`number` = `...`

#### Returns

`void`
