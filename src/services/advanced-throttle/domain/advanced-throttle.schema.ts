import { z } from 'zod';
import type { HttpRequestLike } from '@/security';
import { SetMetadata } from "@nestjs/common";

/**
 * Zod schema для runtime-валидации конфига @RateLimit().
 * z.function() не сериализуется через metadata — keyGenerator
 * передаётся as-is, валидируется только на уровне типов TS.
 */
export const RateLimitConfigSchema = z.object({
  /** Окно в миллисекундах, напр. 60_000 (1 мин) */
  windowMs: z.number().int().positive(),

  /** Максимум запросов в окне */
  max: z.number().int().positive(),

  /** Сообщение при 429 */
  message: z.string().min(1),

  /** Пропускать успешные запросы (не реализовано) */
  skipSuccessfulRequest: z.boolean().optional(),

  /** Пропускать упавшие запросы (не реализовано) */
  skipFailedRequest: z.boolean().optional(),

  /**
   * Кастомный генератор ключа.
   * z.function() намеренно НЕ добавлен — функции не проходят
   * через SetMetadata/Reflect сериализацию без потерь.
   * Тип проверяется только TypeScript-ом.
   */
  keyGenerator: z
    .custom<(req: HttpRequestLike) => string>(
      (val) => val === undefined || typeof val === 'function',
      { message: 'keyGenerator must be a function' },
    )
    .optional(),
});

/** Inferred TS-тип из схемы — единственный источник правды */
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

/**
 * Парсит и валидирует конфиг с понятными ошибками.
 * Используется в @RateLimit() decorator для fail-fast на старте.
 */
export function parseRateLimitConfig(input: unknown): RateLimitConfig {
  const result = RateLimitConfigSchema.safeParse(input);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  [${i.path.join('.')}] ${i.message}`)
      .join('\n');
    throw new Error(`@RateLimit() invalid config:\n${issues}`);
  }

  return result.data;
}

export const RateLimit = (config: RateLimitConfig) => SetMetadata('rateLimit', config);
