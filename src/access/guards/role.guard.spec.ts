import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';

const makeContext = (user?: unknown): ExecutionContext =>
  ({
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('RoleGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: RoleGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RoleGuard(reflector);
  });

  it('должен пропускать запрос, если metadata с ролями отсутствует', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it('должен бросать ForbiddenException, если user отсутствует', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    expect(() => guard.canActivate(makeContext(undefined))).toThrow(ForbiddenException);
    expect(() => guard.canActivate(makeContext(undefined))).toThrow(
      'Authenticated user not found',
    );
  });

  it('должен бросать ForbiddenException, если user.roles невалиден', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    expect(() =>
      guard.canActivate(
        makeContext({
          id: 1,
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          roles: [{ bad: true }],
        }),
      ),
    ).toThrow('User roles are not available');
  });

  it('должен пропускать, если у пользователя есть одна из требуемых ролей', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN', 'MODERATOR']);

    const user = {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [
        {
          name: 'MODERATOR',
          description: '',
          permissions: [],
        },
      ],
    };

    expect(guard.canActivate(makeContext(user))).toBe(true);
  });

  it('должен бросать ForbiddenException, если у пользователя нет ни одной требуемой роли', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const user = {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [
        {
          name: 'USER',
          description: '',
          permissions: [],
        },
      ],
    };

    expect(() => guard.canActivate(makeContext(user))).toThrow(ForbiddenException);
    expect(() => guard.canActivate(makeContext(user))).toThrow('Insufficient roles');
  });

  it('должен использовать handler и class при вызове getAllAndOverride', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const ctx = makeContext({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [
        {
          name: 'ADMIN',
          description: '',
          permissions: [],
        },
      ],
    });

    guard.canActivate(ctx);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      expect.anything(),
      [ctx.getHandler(), ctx.getClass()],
    );
  });
});