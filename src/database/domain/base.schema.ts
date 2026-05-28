import { z } from 'zod';

export const BaseNoUpadteSchema = z.object({
  id: z.number().int().describe('Внутренний ID  (PK)'),
  uuid: z.uuid().describe('Публичный UUID для фронтенда и внешних API'),
  createdAt: z.iso.datetime({ message: 'Invalid ISO date format', offset: true }).optional(),
});

export const BaseSchema = BaseNoUpadteSchema.extend({
  updatedAt: z.iso.datetime({ message: 'Invalid ISO date format', offset: true }).optional(),
});
