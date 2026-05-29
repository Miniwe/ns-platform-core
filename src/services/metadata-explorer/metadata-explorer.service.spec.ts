import 'reflect-metadata';
import { PERMISSIONS_KEY } from '@/security';
import { MetadataExplorerService } from './metadata-explorer.service';

describe('MetadataExplorerService', () => {
  let discoveryService: { getControllers: jest.Mock };
  let cacheService: { getWithFallback: jest.Mock };
  let service: MetadataExplorerService;

  beforeEach(() => {
    discoveryService = {
      getControllers: jest.fn(),
    };

    cacheService = {
      getWithFallback: jest.fn(async (_key, factory) => factory()),
    };

    service = new MetadataExplorerService(discoveryService as any, cacheService as any);
  });

  it('findAllMetadata collects metadata from controller methods', () => {
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

    const result = service.findAllMetadata(PERMISSIONS_KEY as unknown as string);

    expect(result).toEqual([
      {
        controller: 'TestController',
        method: 'secured',
        metadata: [{ resource: 'users', action: 'read' }],
      },
    ]);
  });

  it('findAllMetadata skips wrappers without instance or metatype', () => {
    discoveryService.getControllers.mockReturnValue([
      { instance: null, metatype: null },
      { instance: {}, metatype: null },
    ]);

    expect(service.findAllMetadata(PERMISSIONS_KEY as unknown as string)).toEqual([]);
  });

  it('getAllPermissions uses cache and flattens all metadata', async () => {
    jest.spyOn(service, 'findAllMetadata').mockReturnValue([
      {
        controller: 'A',
        method: 'x',
        metadata: [{ resource: 'users', action: 'read' }],
      },
      {
        controller: 'B',
        method: 'y',
        metadata: [{ resource: 'users', action: 'update' }],
      },
    ]);

    const result = await service.getAllPermissions();

    expect(cacheService.getWithFallback).toHaveBeenCalledWith(
      'permissions:all',
      expect.any(Function),
      expect.objectContaining({
        ttl: 60 * 60,
        tags: [PERMISSIONS_KEY],
        refreshTtl: null,
      }),
    );

    expect(result).toEqual([
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
    ]);
  });
});