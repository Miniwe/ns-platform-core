import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionGuard } from './permission.guard';

const makeContext = (user?: unknown): ExecutionContext =>
  ({
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('PermissionGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: PermissionGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new PermissionGuard(reflector);
  });

  it('должен пропускать, если metadata с permissions отсутствует', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it('должен бросать ForbiddenException, если user отсутствует', () => {
    reflector.getAllAndOverride.mockReturnValue([{ resource: 'users', action: 'read' }]);

    expect(() => guard.canActivate(makeContext(undefined))).toThrow(ForbiddenException);
  });

  it('должен бросать ForbiddenException, если user.roles невалиден', () => {
    reflector.getAllAndOverride.mockReturnValue([{ resource: 'users', action: 'read' }]);

    expect(() =>
      guard.canActivate(makeContext({ roles: [{ wrong: true }] })),
    ).toThrow('User roles are not available');
  });

  it('должен пропускать, если permission есть в role.permissions', () => {
    reflector.getAllAndOverride.mockReturnValue([{ resource: 'users', action: 'read' }]);

    const user = {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [
        {
          name: 'ADMIN',
          description: '',
          permissions: [{ resource: 'users', action: 'read' }],
        },
      ],
    };

    expect(guard.canActivate(makeContext(user))).toBe(true);
  });

  it('должен бросать ForbiddenException, если permission не найден', () => {
    reflector.getAllAndOverride.mockReturnValue([{ resource: 'users', action: 'delete' }]);

    const user = {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [
        {
          name: 'ADMIN',
          description: '',
          permissions: [{ resource: 'users', action: 'read' }],
        },
      ],
    };

    expect(() => guard.canActivate(makeContext(user))).toThrow('Insufficient permissions');
  });

  it('должен требовать все permissions из metadata', () => {
    reflector.getAllAndOverride.mockReturnValue([
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
    ]);

    const user = {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      roles: [
        {
          name: 'ADMIN',
          description: '',
          permissions: [
            { resource: 'users', action: 'read' },
            { resource: 'users', action: 'update' },
          ],
        },
      ],
    };

    expect(guard.canActivate(makeContext(user))).toBe(true);
  });
});