import { z } from 'zod';

export const CacheOptionsSchema = z.object({
  ttl: z.number().optional().default(600), // 10 минут по умолчанию
  tags: z.array(z.string()).optional(),
  version: z.string().optional(),
  refreshTtl: z.boolean().optional().default(false),
});

export type CacheOptions = z.infer<typeof CacheOptionsSchema>;
