import 'reflect-metadata';
import { ANY_PERMISSIONS_KEY, PERMISSION_CACHE_TAG, PERMISSIONS_KEY } from '@/security';
import { MetadataExplorerService } from './metadata-explorer.service';

describe('MetadataExplorerService', () => {
  let discoveryService: { getControllers: jest.Mock };
  let cacheService: { getWithFallback: jest.Mock; delete: jest.Mock };
  let service: MetadataExplorerService;

  beforeEach(() => {
    discoveryService = {
      getControllers: jest.fn(),
    };

    cacheService = {
      getWithFallback: jest.fn(async (_key, factory) => factory()),
      delete: jest.fn(async () => undefined),
    };

    service = new MetadataExplorerService(discoveryService as any, cacheService as any);
  });

  it('findAllMetadata собирает metadata с методов контроллера', () => {
    class TestController {
      secured() {}
      open() {}
    }

    Reflect.defineMetadata(
      PERMISSIONS_KEY,
      [{ resource: 'users', action: 'read' }],
      TestController.prototype.secured,
    );

    discoveryService.getControllers.mockReturnValue([
      {
        instance: new TestController(),
        metatype: TestController,
      },
    ]);

    expect(service.findAllMetadata(PERMISSIONS_KEY)).toEqual([
      {
        controller: 'TestController',
        method: 'secured',
        metadata: [{ resource: 'users', action: 'read' }],
      },
    ]);
  });

  it('findAllMetadata пропускает обёртки без instance или metatype', () => {
    discoveryService.getControllers.mockReturnValue([
      { instance: null, metatype: null },
      { instance: {}, metatype: null },
    ]);

    expect(service.findAllMetadata(PERMISSIONS_KEY)).toEqual([]);
  });

  it('getPermissionCatalog кеширует результат на час в миллисекундах', async () => {
    jest.spyOn(service, 'findAllMetadata').mockReturnValue([]);

    await service.getPermissionCatalog();

    expect(cacheService.getWithFallback).toHaveBeenCalledWith(
      'permissions:catalog',
      expect.any(Function),
      expect.objectContaining({
        ttl: 60 * 60 * 1000,
        tags: [PERMISSION_CACHE_TAG],
        refreshTtl: false,
      }),
    );
  });

  it('getPermissionCatalog группирует по ресурсу и схлопывает дубли', async () => {
    jest.spyOn(service, 'findAllMetadata').mockImplementation((key) =>
      key === PERMISSIONS_KEY
        ? [
            { controller: 'A', method: 'x', metadata: [{ resource: 'users', action: 'read' }] },
            { controller: 'B', method: 'y', metadata: [{ resource: 'users', action: 'read' }] },
            { controller: 'B', method: 'z', metadata: [{ resource: 'roles', action: 'create' }] },
          ]
        : [],
    );

    const catalog = await service.getPermissionCatalog();

    expect(catalog.map((group) => group.resource)).toEqual(['roles', 'users']);

    const users = catalog.find((group) => group.resource === 'users')!;

    expect(users.permissions).toHaveLength(1);
    expect(users.permissions[0].key).toBe('users:read');
    expect(users.permissions[0].usages).toEqual([
      { controller: 'A', method: 'x', mode: 'all' },
      { controller: 'B', method: 'y', mode: 'all' },
    ]);
  });

  it('getPermissionCatalog учитывает права из @RequireAnyPermission', async () => {
    jest.spyOn(service, 'findAllMetadata').mockImplementation((key) =>
      key === ANY_PERMISSIONS_KEY
        ? [{ controller: 'A', method: 'x', metadata: [{ resource: 'users', action: 'export' }] }]
        : [],
    );

    const catalog = await service.getPermissionCatalog();

    expect(catalog[0].permissions[0].usages).toEqual([
      { controller: 'A', method: 'x', mode: 'any' },
    ]);
  });

  it('getAllPermissions отдаёт плоский список без дублей', async () => {
    jest.spyOn(service, 'findAllMetadata').mockImplementation((key) =>
      key === PERMISSIONS_KEY
        ? [
            { controller: 'A', method: 'x', metadata: [{ resource: 'users', action: 'read' }] },
            { controller: 'B', method: 'y', metadata: [{ resource: 'users', action: 'read' }] },
            { controller: 'B', method: 'z', metadata: [{ resource: 'users', action: 'update' }] },
          ]
        : [],
    );

    expect(await service.getAllPermissions()).toEqual([
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
    ]);
  });

  it('invalidateCatalog удаляет ключ каталога', async () => {
    await service.invalidateCatalog();

    expect(cacheService.delete).toHaveBeenCalledWith('permissions:catalog');
  });
});
