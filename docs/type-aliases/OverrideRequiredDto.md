[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / OverrideRequiredDto

# Type Alias: OverrideRequiredDto\<T, K\>

> **OverrideRequiredDto**\<`T`, `K`\> = `Omit`\<`T`, `K`\> & `{ [P in K]-?: T[P] }`

Defined in: [src/types/dto.types.ts:23](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/types/dto.types.ts#L23)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
