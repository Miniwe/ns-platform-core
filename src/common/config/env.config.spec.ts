import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { baseEnvSchema, createValidateFn, LibConfigService } from './env.config';

describe('EnvConfig (Библиотека конфигурации)', () => {
  describe('createValidateFn (Фабрика валидации)', () => {
    it('должна успешно валидировать базовую схему и возвращать дефолтные значения', () => {
      const validate = createValidateFn(baseEnvSchema);

      // Передаем пустой объект (имитируем отсутствие .env)
      const result = validate({});

      expect(result).toEqual({
        NODE_ENV: 'development',
        NEST_PORT: 4000,
      });
    });

    it('должна приводить типы (coerce) для чисел', () => {
      const validate = createValidateFn(baseEnvSchema);
      const result = validate({ NEST_PORT: '5000' }); // Передаем строку

      expect(result.NEST_PORT).toBe(5000); // Получаем число
    });

    it('должна успешно валидировать РАСШИРЕННУЮ схему приложения', () => {
      // Имитируем расширение схемы в самом приложении
      const appSchema = baseEnvSchema.extend({
        DATABASE_URL: z.string().url(),
      });
      const validate = createValidateFn(appSchema);

      const result = validate({
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      });

      expect(result.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/db');
      expect(result.NEST_PORT).toBe(4000); // Базовое значение тоже на месте
    });

    it('должна выбрасывать ошибку при невалидных данных', () => {
      const appSchema = baseEnvSchema.extend({
        JWT_SECRET: z.string().min(32),
      });
      const validate = createValidateFn(appSchema);

      // Глушим console.error в тесте, чтобы не спамить в терминал
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // JWT_SECRET слишком короткий — должно упасть
      expect(() => validate({ JWT_SECRET: 'short' })).toThrow('Invalid environment variables');
    });
  });

  describe('LibConfigService (Интеграция в NestJS)', () => {
    let service: LibConfigService;

    beforeEach(async () => {
      // Создаем расширенную схему для конкретного теста
      const testSchema = baseEnvSchema.extend({
        CUSTOM_API_KEY: z.string(),
      });

      // Имитируем переменные процесса
      process.env.CUSTOM_API_KEY = 'secret_key';
      process.env.NEST_PORT = '9000';

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            validate: createValidateFn(testSchema),
          }),
        ],
        providers: [LibConfigService],
      }).compile();

      service = module.get<LibConfigService>(LibConfigService);
    });

    afterEach(() => {
      // Очищаем env после теста
      delete process.env.CUSTOM_API_KEY;
      delete process.env.NEST_PORT;
    });

    it('должен быть определен', () => {
      expect(service).toBeDefined();
    });

    it('должен возвращать правильное значение из базовой схемы', () => {
      expect(service.get('NEST_PORT', { infer: true })).toBe(9000);
    });

    it('должен корректно работать кастомный геттер isProduction', () => {
      expect(service.isProduction).toBe(false); // По дефолту development
    });

    it('должен возвращать значение из расширенной схемы приложения', () => {
      // Применяем приведение типов <any> или интерфейса в тесте,
      // так как по умолчанию внутри библиотеки сервис знает только про BaseEnvConfig
      expect(service.get('CUSTOM_API_KEY' as any)).toBe('secret_key');
    });
  });
});
