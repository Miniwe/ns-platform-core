import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OwnerGuard } from './owner.guard';

const makeContext = (
  userId?: string | number,
  params?: Record<string, string | undefined>,
): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        user: userId !== undefined ? { id: userId } : undefined,
        params,
      }),
    }),
  }) as unknown as ExecutionContext;

describe('OwnerGuard', () => {
  it('должен пропускать, если user.id совпадает с params.id', () => {
    const guard = new OwnerGuard();

    expect(guard.canActivate(makeContext(42, { id: '42' }))).toBe(true);
  });

  it('должен бросать ForbiddenException, если user отсутствует', () => {
    const guard = new OwnerGuard();

    expect(() => guard.canActivate(makeContext(undefined, { id: '42' }))).toThrow(
      ForbiddenException,
    );
  });

  it('должен бросать ForbiddenException, если params.id отсутствует', () => {
    const guard = new OwnerGuard();

    expect(() => guard.canActivate(makeContext(42, {}))).toThrow(ForbiddenException);
  });

  it('должен бросать ForbiddenException, если id не совпадают', () => {
    const guard = new OwnerGuard();

    expect(() => guard.canActivate(makeContext(42, { id: '43' }))).toThrow(
      'У вас нет доступа к чужому ресурсу',
    );
  });

  it('должен работать с кастомным paramName', () => {
    const guard = new OwnerGuard('userId');

    expect(guard.canActivate(makeContext(42, { userId: '42' }))).toBe(true);
  });
});