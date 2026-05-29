import { JwtPayloadSchema } from './jwt-payload.schema';

describe('JwtPayloadSchema', () => {
  it('должен парсить валидный payload', () => {
    const result = JwtPayloadSchema.parse({
      sub: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result).toEqual({
      sub: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('должен падать без sub', () => {
    expect(() =>
      JwtPayloadSchema.parse({
        uuid: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).toThrow();
  });
});