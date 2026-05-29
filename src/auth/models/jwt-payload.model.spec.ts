import { JwtPayloadDto } from './jwt-payload.model';
import { JwtPayloadSchema } from '../schemas';

describe('JwtPayloadDto', () => {
  it('должен быть определён', () => {
    expect(JwtPayloadDto).toBeDefined();
    expect(typeof JwtPayloadDto).toBe('function');
  });

  it('должен соответствовать валидной JwtPayloadSchema', () => {
    const payload = {
      sub: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    };

    expect(JwtPayloadSchema.parse(payload)).toEqual(payload);
  });

  it('должен падать на невалидном payload без sub', () => {
    expect(() =>
      JwtPayloadSchema.parse({
        uuid: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).toThrow();
  });

  it('должен падать на невалидном payload с битым uuid', () => {
    expect(() =>
      JwtPayloadSchema.parse({
        sub: 1,
        uuid: 'not-a-uuid',
      }),
    ).toThrow();
  });
});