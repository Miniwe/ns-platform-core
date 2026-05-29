[**@miniwe/ns-platform-core**](../README.md)

***

[@miniwe/ns-platform-core](../README.md) / AuthSessionSchema

# Variable: AuthSessionSchema

> `const` **AuthSessionSchema**: `ZodObject`\<\{ `accessToken`: `ZodString`; `expiresIn`: `ZodNumber`; `refreshExpiresIn`: `ZodOptional`\<`ZodNumber`\>; `refreshToken`: `ZodOptional`\<`ZodString`\>; `tokenType`: `ZodLiteral`\<`"Bearer"`\>; `user`: `ZodObject`\<\{ `id`: `ZodNumber`; `roles`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodDefault`\<`ZodString`\>; `name`: `ZodString`; `permissions`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<..., ...\>\>\>; \}, `$strip`\>\>\>; `uuid`: `ZodUUID`; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/auth/schemas/auth-session.schema.ts:17](https://github.com/Miniwe/ns-platform-core/blob/a126d8650d697c693acff88ffc68008bea10e330/src/auth/schemas/auth-session.schema.ts#L17)
