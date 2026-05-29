[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / ColumnDateTransformer

# Class: ColumnDateTransformer

Defined in: [src/transformers/date.transformer.ts:3](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/transformers/date.transformer.ts#L3)

## Implements

- `ValueTransformer`

## Constructors

### Constructor

> **new ColumnDateTransformer**(): `ColumnDateTransformer`

#### Returns

`ColumnDateTransformer`

## Methods

### from()

> **from**(`value?`): `Date` \| `null`

Defined in: [src/transformers/date.transformer.ts:16](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/transformers/date.transformer.ts#L16)

Used to unmarshal data when reading from the database.

#### Parameters

##### value?

`string` \| `Date` \| `null`

#### Returns

`Date` \| `null`

#### Implementation of

`ValueTransformer.from`

***

### to()

> **to**(`value?`): `Date` \| `null`

Defined in: [src/transformers/date.transformer.ts:4](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/transformers/date.transformer.ts#L4)

Used to marshal data when writing to the database.

#### Parameters

##### value?

`string` \| `Date` \| `null`

#### Returns

`Date` \| `null`

#### Implementation of

`ValueTransformer.to`
