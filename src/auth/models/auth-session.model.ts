import { createZodDto } from 'nestjs-zod';
import { AuthTokensSchema, AuthSessionSchema } from '../schemas';

export class AuthTokensDto extends createZodDto(AuthTokensSchema) {}
export class AuthSessionDto extends createZodDto(AuthSessionSchema) {}