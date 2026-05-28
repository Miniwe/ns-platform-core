// src/shared/services/error-handling/error-context.schema.ts
import { z } from 'zod';

export const ErrorContextSchema = z
  .object({
    // Технический контекст
    service: z.string().optional().describe('Имя сервиса'),
    module: z.string().optional().describe('Имя модуля'),
    componentMethod: z.string().optional().describe('Метод, где возникла ошибка'),

    // Бизнес контекст (из старого проекта)
    entityName: z.string().optional().describe('Имя сущности'),
    entityId: z.union([z.string(), z.number()]).optional(),
    userId: z.number().optional(),

    // HTTP контекст
    url: z.string().optional(),
    method: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),

    // Дополнительные данные
    data: z.any().optional(),
    stack: z.string().optional(),
  })
  .passthrough();

export type ErrorContext = z.infer<typeof ErrorContextSchema>;
