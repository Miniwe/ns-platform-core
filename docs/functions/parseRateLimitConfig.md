[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / parseRateLimitConfig

# Function: parseRateLimitConfig()

> **parseRateLimitConfig**(`input`): `object`

Defined in: [src/services/advanced-throttle/domain/advanced-throttle.schema.ts:47](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/services/advanced-throttle/domain/advanced-throttle.schema.ts#L47)

Парсит и валидирует конфиг с понятными ошибками.
Используется в @RateLimit() decorator для fail-fast на старте.

## Parameters

### input

`unknown`

## Returns

### keyGenerator?

> `optional` **keyGenerator?**: (`req`) => `string`

Кастомный генератор ключа.
z.function() намеренно НЕ добавлен — функции не проходят
через SetMetadata/Reflect сериализацию без потерь.
Тип проверяется только TypeScript-ом.

#### Parameters

##### req

`HttpRequestLike`

#### Returns

`string`

### max

> **max**: `number`

Максимум запросов в окне

### message

> **message**: `string`

Сообщение при 429

### skipFailedRequest?

> `optional` **skipFailedRequest?**: `boolean`

Пропускать упавшие запросы (не реализовано)

### skipSuccessfulRequest?

> `optional` **skipSuccessfulRequest?**: `boolean`

Пропускать успешные запросы (не реализовано)

### windowMs

> **windowMs**: `number`

Окно в миллисекундах, напр. 60_000 (1 мин)
