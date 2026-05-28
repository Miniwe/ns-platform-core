import { z } from 'zod';

export const RedisEnvSchema = z.object({
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().positive(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().min(0).default(0),
});

export type RedisEnvConfig = z.infer<typeof RedisEnvSchema>;