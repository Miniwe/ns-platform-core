import { PERMISSION_CACHE_TAG } from '@/security';
import { PermissionResolverService } from './permission-resolver.service';

describe('PermissionResolverService', () => {
  const user = {
    id: 7,
    roles: [{ name: 'ADMIN', permissions: [{ resource: 'users', action: 'read' }] }],
  };

  const makeCache = () => ({
    get: jest.fn(async () => undefined),
    set: jest.fn(async () => undefined),
    delete: jest.fn(async () => undefined),
    invalidateTag: jest.fn(async () => 0),
  });

  it('без источника берёт права из ролей запроса', async () => {
    const service = new PermissionResolverService();

    await expect(service.resolve(user)).resolves.toEqual([{ resource: 'users', action: 'read' }]);
  });

  it('без источника нормализует регистр и убирает дубли', async () => {
    const service = new PermissionResolverService();

    const result = await service.resolve({
      id: 1,
      roles: [
        { name: 'A', permissions: [{ resource: 'USERS', action: 'READ' }] },
        { name: 'B', permissions: [{ resource: 'users', action: 'read' }] },
      ],
    });

    expect(result).toEqual([{ resource: 'users', action: 'read' }]);
  });

  it('с источником читает права из хранилища и кладёт в кеш', async () => {
    const cache = makeCache();
    const source = { getUserPermissions: jest.fn(async () => [{ resource: 'ROLES', action: 'CREATE' }]) };
    const service = new PermissionResolverService(source as never, cache as never);

    const result = await service.resolve(user);

    expect(result).toEqual([{ resource: 'roles', action: 'create' }]);
    expect(source.getUserPermissions).toHaveBeenCalledWith(7);
    expect(cache.set).toHaveBeenCalledWith(
      'user:7:permissions',
      [{ resource: 'roles', action: 'create' }],
      expect.objectContaining({ tags: [PERMISSION_CACHE_TAG], refreshTtl: false }),
    );
  });

  it('при попадании в кеш не ходит в источник', async () => {
    const cache = makeCache();
    cache.get = jest.fn(async () => [{ resource: 'users', action: 'read' }]) as never;
    const source = { getUserPermissions: jest.fn(async () => []) };
    const service = new PermissionResolverService(source as never, cache as never);

    await expect(service.resolve(user)).resolves.toEqual([{ resource: 'users', action: 'read' }]);
    expect(source.getUserPermissions).not.toHaveBeenCalled();
  });

  it('TTL кеша берётся из настроек модуля', async () => {
    const cache = makeCache();
    const source = { getUserPermissions: jest.fn(async () => []) };
    const service = new PermissionResolverService(source as never, cache as never, {
      permissionCacheTtlMs: 1234,
    });

    await service.resolve(user);

    expect(cache.set).toHaveBeenCalledWith(
      expect.any(String),
      [],
      expect.objectContaining({ ttl: 1234 }),
    );
  });

  it('invalidateUser удаляет ключ одного пользователя', async () => {
    const cache = makeCache();
    const service = new PermissionResolverService(undefined, cache as never);

    await service.invalidateUser(7);

    expect(cache.delete).toHaveBeenCalledWith('user:7:permissions');
  });

  it('invalidateAll сбрасывает кеш по тегу', async () => {
    const cache = makeCache();
    const service = new PermissionResolverService(undefined, cache as never);

    await service.invalidateAll();

    expect(cache.invalidateTag).toHaveBeenCalledWith(PERMISSION_CACHE_TAG);
  });

  it('работает без кеша — источник читается каждый раз', async () => {
    const source = { getUserPermissions: jest.fn(async () => [{ resource: 'a', action: 'b' }]) };
    const service = new PermissionResolverService(source as never);

    await service.resolve(user);
    await service.resolve(user);

    expect(source.getUserPermissions).toHaveBeenCalledTimes(2);
  });
});

describe('PermissionResolverService — ленивый поиск источника', () => {
  const user = { id: 3, roles: [] };

  it('находит источник через ModuleRef, когда он не внедрён напрямую', async () => {
    const source = { getUserPermissions: jest.fn(async () => [{ resource: 'a', action: 'b' }]) };
    const moduleRef = { get: jest.fn(() => source) };

    const service = new PermissionResolverService(
      undefined,
      undefined,
      undefined,
      moduleRef as never,
    );

    await expect(service.resolve(user)).resolves.toEqual([{ resource: 'a', action: 'b' }]);
    expect(moduleRef.get).toHaveBeenCalledWith(expect.anything(), { strict: false });
  });

  it('ищет источник один раз и запоминает результат', async () => {
    const source = { getUserPermissions: jest.fn(async () => []) };
    const moduleRef = { get: jest.fn(() => source) };

    const service = new PermissionResolverService(
      undefined,
      undefined,
      undefined,
      moduleRef as never,
    );

    await service.resolve(user);
    await service.resolve(user);

    expect(moduleRef.get).toHaveBeenCalledTimes(1);
  });

  it('откатывается на права из токена, если источник не зарегистрирован', async () => {
    const moduleRef = {
      get: jest.fn(() => {
        throw new Error('not found');
      }),
    };

    const service = new PermissionResolverService(
      undefined,
      undefined,
      undefined,
      moduleRef as never,
    );

    await expect(
      service.resolve({ id: 1, roles: [{ name: 'A', permissions: [{ resource: 'x', action: 'y' }] }] }),
    ).resolves.toEqual([{ resource: 'x', action: 'y' }]);
  });
});
