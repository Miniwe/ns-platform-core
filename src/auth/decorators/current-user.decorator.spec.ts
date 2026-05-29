import { ExecutionContext } from '@nestjs/common';
import { currentUserFactory } from './current-user.decorator';

describe('currentUserFactory', () => {
  const user = {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    roles: [],
  };

  const makeCtx = (value?: typeof user): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user: value }),
      }),
    }) as unknown as ExecutionContext;

  it('должен возвращать весь user, если data не передан', () => {
    expect(currentUserFactory(undefined, makeCtx(user))).toEqual(user);
  });

  it('должен возвращать конкретное поле пользователя', () => {
    expect(currentUserFactory('id', makeCtx(user))).toBe(1);
    expect(currentUserFactory('uuid', makeCtx(user))).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );
  });

  it('должен возвращать undefined для отсутствующего поля', () => {
    expect(currentUserFactory('missingField', makeCtx(user))).toBeUndefined();
  });

  it('должен возвращать undefined, если user отсутствует', () => {
    const ctx = makeCtx(undefined);

    expect(currentUserFactory(undefined, ctx)).toBeUndefined();
    expect(currentUserFactory('id', ctx)).toBeUndefined();
  });
});