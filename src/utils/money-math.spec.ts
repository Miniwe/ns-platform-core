import { MoneyMath } from './money-math';

describe('MoneyMath', () => {
  it('корректно складывает и вычитает Decimal-compatible значения', () => {
    expect(MoneyMath.add('10.15', '2.35').toString()).toBe('12.5');
    expect(MoneyMath.sub('10.15', '2.35').toString()).toBe('7.8');
  });

  it('div() округляет до 4 знаков по ROUND_HALF_UP', () => {
    expect(MoneyMath.div('10', '3').toString()).toBe('3.3333');
    expect(MoneyMath.div('2', '3').toString()).toBe('0.6667');
  });

  it('toFixed4() и toFixed2() форматируют как ожидается', () => {
    expect(MoneyMath.toFixed4('12.34567')).toBe('12.3457');
    expect(MoneyMath.toFixed2('12.34567')).toBe('12.35');
  });
});