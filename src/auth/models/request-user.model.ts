import { createZodDto } from 'nestjs-zod';
import { RequestUserSchema } from '@/security';

export class RequestUserDto extends createZodDto(RequestUserSchema) {}