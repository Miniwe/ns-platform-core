import Decimal from 'decimal.js';

export const decimalTransformer = {
  to: (data?: Decimal): string | null => (data ? data.toString() : null),
  from: (data?: string): Decimal | null => (data ? new Decimal(data) : null),
};
