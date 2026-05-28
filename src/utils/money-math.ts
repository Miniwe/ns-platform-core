import { Decimal } from 'decimal.js';

// Настройка дефолтного округления для всего проекта, если нужно
Decimal.set({ rounding: Decimal.ROUND_HALF_UP });

export class MoneyMath {
  static add(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).plus(new Decimal(b));
  }

  static sub(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).minus(new Decimal(b));
  }

  static mul(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).times(new Decimal(b));
  }

  static div(a: Decimal.Value, b: Decimal.Value): Decimal {
    // Округление до 4 знаков (ROUND_HALF_UP)
    return new Decimal(a).dividedBy(new Decimal(b)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
  }

  static toFixed4(d: Decimal.Value): string {
    return new Decimal(d).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toFixed(4);
  }

  static toFixed2(d: Decimal.Value): string {
    return new Decimal(d).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
  }
}
