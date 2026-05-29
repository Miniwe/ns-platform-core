[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / createValidateFn

# Function: createValidateFn()

> **createValidateFn**\<`T`\>(`extendedSchema`): (`config`) => `$InferObjectOutput`\<`T`, \{ \}\>

Defined in: [src/config/env.config.ts:17](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/config/env.config.ts#L17)

ФАБРИКА ВАЛИДАЦИИ
Принимает расширенную схему из приложения и возвращает функцию для ConfigModule.forRoot({ validate })

## Type Parameters

### T

`T` *extends* `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\>

## Parameters

### extendedSchema

`ZodObject`\<`T`\>

## Returns

(`config`) => `$InferObjectOutput`\<`T`, \{ \}\>
