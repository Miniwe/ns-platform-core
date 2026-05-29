import { Decimal } from 'decimal.js';
import { ColumnNumericTransformer } from './numeric.transformer';

describe('ColumnNumericTransformer', () => {
  let transformer: ColumnNumericTransformer;

  beforeEach(() => {
    transformer = new ColumnNumericTransformer();
  });

  it('to() преобразует Decimal в string', () => {
    const value = new Decimal('123.4567');
    expect(transformer.to(value)).toBe('123.4567');
  });

  it('from() преобразует string в Decimal', () => {
    const result = transformer.from('789.1234');

    expect(result).toBeInstanceOf(Decimal);
    expect(result?.toString()).toBe('789.1234');
  });

  it('корректно обрабатывает null/undefined', () => {
    expect(transformer.to(null)).toBeNull();
    expect(transformer.to(undefined)).toBeNull();
    expect(transformer.from(null)).toBeNull();
    expect(transformer.from(undefined)).toBeNull();
  });
});