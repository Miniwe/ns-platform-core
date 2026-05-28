import { ValueTransformer } from 'typeorm';
import { Decimal } from 'decimal.js';

export class ColumnNumericTransformer implements ValueTransformer {
  to(data: Decimal | null | undefined): string | null {
    return data !== null && data !== undefined ? data.toString() : null;
  }

  from(data: string | null | undefined): Decimal | null {
    return data !== null && data !== undefined ? new Decimal(data) : null;
  }
}
