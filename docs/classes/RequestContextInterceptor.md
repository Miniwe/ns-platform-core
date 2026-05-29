[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / RequestContextInterceptor

# Class: RequestContextInterceptor

Defined in: src/context/request-context.interceptor.ts:7

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

Defined in: src/context/request-context.interceptor.ts:8

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
