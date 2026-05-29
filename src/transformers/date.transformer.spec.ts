import { ColumnDateTransformer } from './date.transformer';

describe('ColumnDateTransformer', () => {
  let transformer: ColumnDateTransformer;

  beforeEach(() => {
    transformer = new ColumnDateTransformer();
  });

  it('to() возвращает null для null/undefined', () => {
    expect(transformer.to(null)).toBeNull();
    expect(transformer.to(undefined)).toBeNull();
  });

  it('to() возвращает тот же Date instance для Date', () => {
    const date = new Date('2026-05-29T12:00:00.000Z');
    expect(transformer.to(date)).toBe(date);
  });

  it('from() парсит строку в Date', () => {
    const result = transformer.from('2026-05-29T12:00:00.000Z');

    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe('2026-05-29T12:00:00.000Z');
  });
});