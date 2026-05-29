import { HasFieldsGuard } from './has-fields.guard';

describe('HasFieldsGuard', () => {
  type LoginPayload = {
    email: string;
    password: string;
  };

  it('returns true when all required fields exist', () => {
    const payload: unknown = {
      email: 'a@a.com',
      password: '123456',
      rememberMe: true,
    };

    expect(HasFieldsGuard<LoginPayload>(payload, ['email', 'password'])).toBe(true);
  });

  it('returns false when at least one required field is missing', () => {
    const payload: unknown = {
      email: 'a@a.com',
    };

    expect(HasFieldsGuard<LoginPayload>(payload, ['email', 'password'])).toBe(false);
  });

  it('returns false for null or non-object values', () => {
    expect(HasFieldsGuard<LoginPayload>(null, ['email', 'password'])).toBe(false);
    expect(HasFieldsGuard<LoginPayload>('not-an-object', ['email', 'password'])).toBe(false);
  });
});