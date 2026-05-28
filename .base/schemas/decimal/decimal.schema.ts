import { z } from 'zod';
import { Decimal } from 'decimal.js';

const decimalStringPattern = /^-?\d+(\.\d+)?$/;

export const DecimalSchema = z
  .custom<Decimal>(
    (val) => {
      if (val instanceof Decimal) return !val.isNaN();
      if (typeof val === 'string' || typeof val === 'number') {
        try {
          return !new Decimal(val).isNaN();
        } catch {
          return false;
        }
      }
      return false;
    },
    { message: 'Value must be a valid Decimal (string, number, or Decimal instance)' },
  )
  .transform((val) => (val instanceof Decimal ? val : new Decimal(val as string | number)))
  .meta({
    type: 'string',
    format: 'decimal',
    pattern: decimalStringPattern.source,
    example: '1.2345',
    description: 'Fixed-precision decimal number serialized as string',
  });

export const DecimalSchemaDto = z.string().regex(/^-?\d+(\.\d+)?$/);
