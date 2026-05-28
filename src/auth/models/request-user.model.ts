import { createZodDto } from 'nestjs-zod';
import { RequestUserSchema } from '../schemas';

export class RequestUserDto extends createZodDto(RequestUserSchema) {}