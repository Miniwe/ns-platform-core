[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AuthSessionSchema

# Variable: AuthSessionSchema

> `const` **AuthSessionSchema**: `ZodObject`\<\{ `accessToken`: `ZodString`; `expiresIn`: `ZodNumber`; `refreshExpiresIn`: `ZodOptional`\<`ZodNumber`\>; `refreshToken`: `ZodOptional`\<`ZodString`\>; `tokenType`: `ZodLiteral`\<`"Bearer"`\>; `user`: `ZodObject`\<\{ `id`: `ZodNumber`; `roles`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodDefault`\<`ZodString`\>; `name`: `ZodString`; `permissions`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<..., ...\>\>\>; \}, `$strip`\>\>\>; `uuid`: `ZodUUID`; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/auth/schemas/auth-session.schema.ts:17](https://github.com/Miniwe/ns-platform-core/blob/750974768ae318de54bebe798d49e38eb283271b/src/auth/schemas/auth-session.schema.ts#L17)
