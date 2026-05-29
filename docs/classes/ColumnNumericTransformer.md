[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / ColumnNumericTransformer

# Class: ColumnNumericTransformer

Defined in: [src/transformers/numeric.transformer.ts:4](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/transformers/numeric.transformer.ts#L4)

## Implements

- `ValueTransformer`

## Constructors

### Constructor

> **new ColumnNumericTransformer**(): `ColumnNumericTransformer`

#### Returns

`ColumnNumericTransformer`

## Methods

### from()

> **from**(`data`): `Decimal` \| `null`

Defined in: [src/transformers/numeric.transformer.ts:9](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/transformers/numeric.transformer.ts#L9)

Used to unmarshal data when reading from the database.

#### Parameters

##### data

`string` \| `null` \| `undefined`

#### Returns

`Decimal` \| `null`

#### Implementation of

`ValueTransformer.from`

***

### to()

> **to**(`data`): `string` \| `null`

Defined in: [src/transformers/numeric.transformer.ts:5](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/transformers/numeric.transformer.ts#L5)

Used to marshal data when writing to the database.

#### Parameters

##### data

`Decimal` \| `null` \| `undefined`

#### Returns

`string` \| `null`

#### Implementation of

`ValueTransformer.to`
