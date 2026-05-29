// advanced-throttle.schema.spec.ts
import { parseRateLimitConfig } from './advanced-throttle.schema';

describe('RateLimitConfigSchema', () => {
  const valid = { windowMs: 60_000, max: 10, message: 'Too many' };

  it('принимает корректный конфиг', () => {
    expect(() => parseRateLimitConfig(valid)).not.toThrow();
  });

  it('возвращает распарсенный объект', () => {
    const result = parseRateLimitConfig(valid);
    expect(result).toMatchObject(valid);
  });

  it('принимает keyGenerator как функцию', () => {
    const config = { ...valid, keyGenerator: (req: any) => req.ip };
    expect(() => parseRateLimitConfig(config)).not.toThrow();
  });

  describe('невалидные конфиги', () => {
    it.each([
      { name: 'windowMs отрицательный', input: { ...valid, windowMs: -1 } },
      { name: 'windowMs ноль', input: { ...valid, windowMs: 0 } },
      { name: 'max ноль', input: { ...valid, max: 0 } },
      { name: 'message пустая строка', input: { ...valid, message: '' } },
      { name: 'message не строка', input: { ...valid, message: 123 } },
      { name: 'нет message', input: { windowMs: 60_000, max: 10 } },
      { name: 'пустой объект', input: {} },
    ])('бросает ошибку: $name', ({ input }) => {
      // ← деструктурируем объект
      expect(() => parseRateLimitConfig(input)).toThrow('@RateLimit() invalid config');
    });
  });

  it('keyGenerator не-функция бросает ошибку', () => {
    expect(() => parseRateLimitConfig({ ...valid, keyGenerator: 'not-a-function' })).toThrow(
      '@RateLimit() invalid config',
    );
  });
});
