[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RequestContextInterceptor

# Class: RequestContextInterceptor

Defined in: [src/context/request-context.interceptor.ts:7](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.interceptor.ts#L7)

## Implements

- `NestInterceptor`

## Constructors

### Constructor

> **new RequestContextInterceptor**(): `RequestContextInterceptor`

#### Returns

`RequestContextInterceptor`

## Methods

### intercept()

> **intercept**(`context`, `next`): `Observable`\<`unknown`\>

Defined in: [src/context/request-context.interceptor.ts:8](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/context/request-context.interceptor.ts#L8)

Method to implement a custom interceptor.

#### Parameters

##### context

`ExecutionContext`

an `ExecutionContext` object providing methods to access the
route handler and class about to be invoked.

##### next

`CallHandler`

a reference to the `CallHandler`, which provides access to an
`Observable` representing the response stream from the route handler.

#### Returns

`Observable`\<`unknown`\>

#### Implementation of

`NestInterceptor.intercept`
