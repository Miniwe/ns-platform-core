import { z } from 'zod';

export const DecimalTransportSchema = z
  .string()
  .regex(/^-?\d+(\.\d+)?$/)
  .describe('Decimal as string');
