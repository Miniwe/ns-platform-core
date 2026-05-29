[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / OverrideOptionalDto

# Type Alias: OverrideOptionalDto\<T, K\>

> **OverrideOptionalDto**\<`T`, `K`\> = `Omit`\<`T`, `K`\> & `{ [P in K]?: T[P] }`

Defined in: [src/types/dto.types.ts:19](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/types/dto.types.ts#L19)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
