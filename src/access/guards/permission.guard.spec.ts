import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ANY_PERMISSIONS_KEY, PERMISSIONS_KEY } from '@/security';
import { PermissionGuard } from './permission.guard';

const makeContext = (user?: unknown): ExecutionContext =>
  ({
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

const userWith = (permissions: Array<{ resource: string; action: string }>, roleName = 'ADMIN') => ({
  id: 1,
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  roles: [{ name: roleName, description: '', permissions }],
});

describe('PermissionGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let metadata: Map<symbol, unknown>;

  const makeGuard = (resolver?: unknown, options?: unknown) =>
    new PermissionGuard(reflector, resolver as never, options as never);

  beforeEach(() => {
    metadata = new Map();

    reflector = {
      getAllAndOverride: jest.fn((key: symbol) => metadata.get(key)),
    } as any;
  });

  it('пропускает, если metadata с правами отсутствует', async () => {
    await expect(makeGuard().canActivate(makeContext())).resolves.toBe(true);
  });

  it('бросает ForbiddenException, если user отсутствует', async () => {
    metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'read' }]);

    await expect(makeGuard().canActivate(makeContext(undefined))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('бросает ForbiddenException, если user.roles невалиден', async () => {
    metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'read' }]);

    await expect(
      makeGuard().canActivate(makeContext({ id: 1, roles: [{ wrong: true }] })),
    ).rejects.toThrow('User roles are not available');
  });

  describe('@RequirePermissions — нужны все права', () => {
    it('пропускает, когда есть все перечисленные', async () => {
      metadata.set(PERMISSIONS_KEY, [
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'update' },
      ]);

      const context = makeContext(
        userWith([
          { resource: 'users', action: 'read' },
          { resource: 'users', action: 'update' },
        ]),
      );

      await expect(makeGuard().canActivate(context)).resolves.toBe(true);
    });

    it('отказывает, когда есть только часть', async () => {
      metadata.set(PERMISSIONS_KEY, [
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'update' },
      ]);

      const context = makeContext(userWith([{ resource: 'users', action: 'read' }]));

      await expect(makeGuard().canActivate(context)).rejects.toThrow('Insufficient permissions');
    });
  });

  describe('@RequireAnyPermission — достаточно одного', () => {
    it('пропускает при совпадении одного права', async () => {
      metadata.set(ANY_PERMISSIONS_KEY, [
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'update' },
      ]);

      const context = makeContext(userWith([{ resource: 'users', action: 'update' }]));

      await expect(makeGuard().canActivate(context)).resolves.toBe(true);
    });

    it('отказывает, когда не совпало ни одно', async () => {
      metadata.set(ANY_PERMISSIONS_KEY, [{ resource: 'users', action: 'delete' }]);

      const context = makeContext(userWith([{ resource: 'users', action: 'read' }]));

      await expect(makeGuard().canActivate(context)).rejects.toThrow('Insufficient permissions');
    });
  });

  it('при обоих декораторах требует выполнения обоих условий', async () => {
    metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'read' }]);
    metadata.set(ANY_PERMISSIONS_KEY, [{ resource: 'users', action: 'export' }]);

    const onlyAll = makeContext(userWith([{ resource: 'users', action: 'read' }]));
    await expect(makeGuard().canActivate(onlyAll)).rejects.toThrow('Insufficient permissions');

    const both = makeContext(
      userWith([
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'export' },
      ]),
    );
    await expect(makeGuard().canActivate(both)).resolves.toBe(true);
  });

  it('сравнивает права без учёта регистра', async () => {
    metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'read' }]);

    const context = makeContext(userWith([{ resource: 'USERS', action: 'READ' } as never]));

    await expect(makeGuard().canActivate(context)).resolves.toBe(true);
  });

  describe('суперроль', () => {
    it('DEVELOPER проходит без прав', async () => {
      metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'delete' }]);

      const context = makeContext(userWith([], 'DEVELOPER'));

      await expect(makeGuard().canActivate(context)).resolves.toBe(true);
    });

    it('ADMIN без прав не проходит', async () => {
      metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'delete' }]);

      const context = makeContext(userWith([], 'ADMIN'));

      await expect(makeGuard().canActivate(context)).rejects.toThrow('Insufficient permissions');
    });

    it('имя суперроли берётся из настроек модуля', async () => {
      metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'delete' }]);

      const guard = makeGuard(undefined, { superRoles: ['maintenance'] });

      await expect(guard.canActivate(makeContext(userWith([], 'MAINTENANCE')))).resolves.toBe(true);
      await expect(guard.canActivate(makeContext(userWith([], 'DEVELOPER')))).rejects.toThrow(
        'Insufficient permissions',
      );
    });
  });

  it('использует резолвер, когда он зарегистрирован', async () => {
    metadata.set(PERMISSIONS_KEY, [{ resource: 'users', action: 'delete' }]);

    const resolver = {
      resolve: jest.fn(async () => [{ resource: 'users', action: 'delete' }]),
    };

    const context = makeContext(userWith([]));

    await expect(makeGuard(resolver).canActivate(context)).resolves.toBe(true);
    expect(resolver.resolve).toHaveBeenCalledTimes(1);
  });
});
