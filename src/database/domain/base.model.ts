import { createZodDto } from 'nestjs-zod';
import { BaseNoUpadteSchema, BaseSchema } from './base.schema';

export class BaseModelNoUpadteDto extends createZodDto(BaseNoUpadteSchema) {}
export class BaseModelDto extends createZodDto(BaseSchema) {}
