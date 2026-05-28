import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { z } from 'zod';

// Базовая схема библиотеки
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEST_PORT: z.coerce.number().default(4000),
});

export type BaseEnvConfig = z.infer<typeof baseEnvSchema>;

/**
 * ФАБРИКА ВАЛИДАЦИИ
 * Принимает расширенную схему из приложения и возвращает функцию для ConfigModule.forRoot({ validate })
 */
export function createValidateFn<T extends z.ZodRawShape>(extendedSchema: z.ZodObject<T>) {
  return (config: Record<string, unknown>) => {
    const result = extendedSchema.safeParse(config);

    if (result.success === false) {
      console.error('❌ Ошибка валидации переменных окружения:');
      console.error(JSON.stringify(result.error.format(), null, 2));
      throw new Error('Invalid environment variables');
    }

    // Возвращает валидированные данные с примененными default-значениями и coerce
    return result.data;
  };
}

/**
 * СТРОГО ТИПИЗИРОВАННЫЙ СЕРВИС
 */
@Injectable()
export class LibConfigService<T extends BaseEnvConfig = BaseEnvConfig> extends NestConfigService<
  T,
  true
> {
  get isProduction(): boolean {
    return this.get('NODE_ENV', { infer: true }) === 'production';
  }
}
