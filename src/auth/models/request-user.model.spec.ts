import { RequestUserDto } from './request-user.model';
import { RequestUserSchema } from '@/security';

describe('RequestUserDto', () => {
  it('должен быть определён', () => {
    expect(RequestUserDto).toBeDefined();
    expect(typeof RequestUserDto).toBe('function');
  });

  it('должен соответствовать валидной RequestUserSchema', () => {
    const payload = {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [],
    };

    expect(RequestUserSchema.parse(payload)).toEqual(payload);
  });

  it('должен подставлять default roles', () => {
    const result = RequestUserSchema.parse({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result).toEqual({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [],
    });
  });

  it('должен падать без id', () => {
    expect(() =>
      RequestUserSchema.parse({
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        roles: [],
      }),
    ).toThrow();
  });

  it('должен падать с невалидным uuid', () => {
    expect(() =>
      RequestUserSchema.parse({
        id: 1,
        uuid: 'invalid-uuid',
        roles: [],
      }),
    ).toThrow();
  });

  it('должен падать с невалидной role', () => {
    expect(() =>
      RequestUserSchema.parse({
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        roles: [{ bad: true }],
      }),
    ).toThrow();
  });
});