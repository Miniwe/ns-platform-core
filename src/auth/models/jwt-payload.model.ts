import { createZodDto } from 'nestjs-zod';
import { JwtPayloadSchema } from '../schemas';

export class JwtPayloadDto extends createZodDto(JwtPayloadSchema) {}