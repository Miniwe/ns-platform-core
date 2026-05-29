[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AuthTokensSchema

# Variable: AuthTokensSchema

> `const` **AuthTokensSchema**: `ZodObject`\<\{ `accessToken`: `ZodString`; `expiresIn`: `ZodNumber`; `refreshExpiresIn`: `ZodOptional`\<`ZodNumber`\>; `refreshToken`: `ZodOptional`\<`ZodString`\>; `tokenType`: `ZodLiteral`\<`"Bearer"`\>; \}, `$strip`\>

Defined in: [src/auth/schemas/auth-session.schema.ts:4](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L4)
