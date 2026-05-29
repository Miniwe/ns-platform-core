import { z } from 'zod';

export const CacheOptionsSchema = z.object({
  ttl: z.number().optional().default(600), // 10 минут по умолчанию
  tags: z.array(z.union([z.string(), z.symbol()])).optional(),
  version: z.string().optional().nullable(),
  refreshTtl: z.boolean().optional().nullable().default(false),
});

export type CacheOptions = z.infer<typeof CacheOptionsSchema>;
