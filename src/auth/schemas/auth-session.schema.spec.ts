import { AuthSessionSchema, AuthTokensSchema } from './auth-session.schema';

describe('AuthTokensSchema', () => {
  it('должен парсить валидные токены', () => {
    const result = AuthTokensSchema.parse({
      accessToken: 'access',
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshExpiresIn: 86400,
    });

    expect(result.accessToken).toBe('access');
  });

  it('должен падать с невалидным tokenType', () => {
    expect(() =>
      AuthTokensSchema.parse({
        accessToken: 'access',
        tokenType: 'Basic',
        expiresIn: 3600,
      }),
    ).toThrow();
  });
});

describe('AuthSessionSchema', () => {
  it('должен парсить валидную auth session', () => {
    const result = AuthSessionSchema.parse({
      accessToken: 'access',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        roles: [],
      },
    });

    expect(result.user.id).toBe(1);
  });

  it('должен падать с невалидным user', () => {
    expect(() =>
      AuthSessionSchema.parse({
        accessToken: 'access',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 1,
        },
      }),
    ).toThrow();
  });
});