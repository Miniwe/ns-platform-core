import Decimal from 'decimal.js';

export function toDecimal(value: string | number | Decimal): Decimal {
  if (value instanceof Decimal) return value;

  const dec = new Decimal(value);

  if (dec.isNaN()) {
    throw new Error('Invalid decimal value');
  }

  return dec;
}
