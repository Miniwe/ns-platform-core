[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RateLimit

# Function: RateLimit()

> **RateLimit**(`config`): `CustomDecorator`\<`string`\>

Defined in: src/services/advanced-throttle/domain/advanced-throttle.schema.ts:60

## Parameters

### config

#### keyGenerator?

(`req`) => `string` = `...`

Кастомный генератор ключа.
z.function() намеренно НЕ добавлен — функции не проходят
через SetMetadata/Reflect сериализацию без потерь.
Тип проверяется только TypeScript-ом.

#### max

`number` = `...`

Максимум запросов в окне

#### message

`string` = `...`

Сообщение при 429

#### skipFailedRequest?

`boolean` = `...`

Пропускать упавшие запросы (не реализовано)

#### skipSuccessfulRequest?

`boolean` = `...`

Пропускать успешные запросы (не реализовано)

#### windowMs

`number` = `...`

Окно в миллисекундах, напр. 60_000 (1 мин)

## Returns

`CustomDecorator`\<`string`\>
