import { RequestUserSchema } from './request-user.schema';

describe('RequestUserSchema', () => {
  it('должен парсить минимальный валидный user', () => {
    const result = RequestUserSchema.parse({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [],
    });

    expect(result).toEqual({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [],
    });
  });

  it('должен подставлять default roles', () => {
    const result = RequestUserSchema.parse({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result.roles).toEqual([]);
  });

  it('должен падать без id', () => {
    expect(() =>
      RequestUserSchema.parse({
        uuid: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).toThrow();
  });

  it('должен падать с невалидным uuid', () => {
    expect(() =>
      RequestUserSchema.parse({
        id: 1,
        uuid: 'bad-uuid',
      }),
    ).toThrow();
  });
});