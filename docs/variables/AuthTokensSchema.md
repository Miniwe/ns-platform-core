[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AuthTokensSchema

# Variable: AuthTokensSchema

> `const` **AuthTokensSchema**: `ZodObject`\<\{ `accessToken`: `ZodString`; `expiresIn`: `ZodNumber`; `refreshExpiresIn`: `ZodOptional`\<`ZodNumber`\>; `refreshToken`: `ZodOptional`\<`ZodString`\>; `tokenType`: `ZodLiteral`\<`"Bearer"`\>; \}, `$strip`\>

Defined in: [src/auth/schemas/auth-session.schema.ts:4](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L4)
