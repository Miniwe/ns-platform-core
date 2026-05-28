import { ValueTransformer } from 'typeorm';

export class ColumnDateTransformer implements ValueTransformer {
  to(value?: Date | string | null): Date | null {
    if (value == null) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  }

  from(value?: Date | string | null): Date | null {
    if (value == null) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  }
}
