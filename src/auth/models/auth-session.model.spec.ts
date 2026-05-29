import { AuthSessionDto, AuthTokensDto } from './auth-session.model';
import { AuthSessionSchema, AuthTokensSchema } from '../schemas';

describe('AuthTokensDto', () => {
  it('должен быть определён', () => {
    expect(AuthTokensDto).toBeDefined();
    expect(typeof AuthTokensDto).toBe('function');
  });

  it('должен соответствовать валидной AuthTokensSchema', () => {
    const payload = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshExpiresIn: 86400,
    };

    expect(AuthTokensSchema.parse(payload)).toEqual(payload);
  });

  it('должен падать на невалидном tokenType', () => {
    expect(() =>
      AuthTokensSchema.parse({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Basic',
        expiresIn: 3600,
      }),
    ).toThrow();
  });

  it('должен падать без accessToken', () => {
    expect(() =>
      AuthTokensSchema.parse({
        tokenType: 'Bearer',
        expiresIn: 3600,
      }),
    ).toThrow();
  });

  it('должен падать при невалидном expiresIn', () => {
    expect(() =>
      AuthTokensSchema.parse({
        accessToken: 'access-token',
        tokenType: 'Bearer',
        expiresIn: 0,
      }),
    ).toThrow();
  });
});

describe('AuthSessionDto', () => {
  it('должен быть определён', () => {
    expect(AuthSessionDto).toBeDefined();
    expect(typeof AuthSessionDto).toBe('function');
  });

  it('должен соответствовать валидной AuthSessionSchema', () => {
    const payload = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshExpiresIn: 86400,
      user: {
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        roles: [],
      },
    };

    expect(AuthSessionSchema.parse(payload)).toEqual(payload);
  });

  it('должен подставлять default roles в user', () => {
    const result = AuthSessionSchema.parse({
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.user.roles).toEqual([]);
  });

  it('должен падать при невалидном user', () => {
    expect(() =>
      AuthSessionSchema.parse({
        accessToken: 'access-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 1,
        },
      }),
    ).toThrow();
  });

  it('должен падать без tokenType', () => {
    expect(() =>
      AuthSessionSchema.parse({
        accessToken: 'access-token',
        expiresIn: 3600,
        user: {
          id: 1,
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          roles: [],
        },
      }),
    ).toThrow();
  });
});