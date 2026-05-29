[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AllExceptionsFilter

# Class: AllExceptionsFilter

Defined in: [src/filters/all-exceptions.filter.ts:11](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/filters/all-exceptions.filter.ts#L11)

## Implements

- `ExceptionFilter`

## Constructors

### Constructor

> **new AllExceptionsFilter**(`errorService`): `AllExceptionsFilter`

Defined in: [src/filters/all-exceptions.filter.ts:12](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/filters/all-exceptions.filter.ts#L12)

#### Parameters

##### errorService

[`ErrorHandlingService`](ErrorHandlingService.md)

#### Returns

`AllExceptionsFilter`

## Methods

### catch()

> **catch**(`exception`, `host`): `void`

Defined in: [src/filters/all-exceptions.filter.ts:14](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/filters/all-exceptions.filter.ts#L14)

Method to implement a custom exception filter.

#### Parameters

##### exception

`unknown`

the class of the exception being handled

##### host

`ArgumentsHost`

used to access an array of arguments for
the in-flight request

#### Returns

`void`

#### Implementation of

`ExceptionFilter.catch`
