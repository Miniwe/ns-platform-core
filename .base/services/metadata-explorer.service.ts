import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import 'reflect-metadata';
import { PermissionDto } from '@/roles/dto/permission.dto';

import { AdvancedCacheService } from './advanced-cache/advanced-cache.service';

type AppPermissionsType = Array<{ controller: string; method: string; metadata: PermissionDto[] }>;

@Injectable()
export class MetadataExplorerService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly cacheService: AdvancedCacheService,
  ) {}

  findAllMetadata(key: string): AppPermissionsType {
    const controllers = this.discoveryService.getControllers();
    const results: AppPermissionsType = [];

    controllers.forEach(({ instance, metatype }) => {
      if (!instance || !metatype) return;
      const prototype = Object.getPrototypeOf(instance);
      const methods = Object.getOwnPropertyNames(prototype).filter(m => m !== 'constructor');

      methods.forEach(method => {
        const metadata = Reflect.getMetadata(key, instance[method]);
        if (metadata !== undefined) {
          results.push({
            controller: metatype.name,
            method,
            metadata,
          });
        }
      });
    });

    return results;
  }

  async getAllPermissions(): Promise<PermissionDto[]> {
    const cacheKey = 'permissions:all';

    const ttl =
      process.env.NODE_ENV === 'production'
        ? 60 * 60 // 60 минут
        : 6 * 60; // 6 минут

    return this.cacheService.getWithFallback(
      cacheKey,
      async () => {
        const allMetaPermissions = this.findAllMetadata('permissions');
        return allMetaPermissions.reduce(
          (all, mp) => [...all, ...mp.metadata],
          [] as PermissionDto[],
        );
      },
      {
        ttl,
        tags: ['permissions'],
      },
    );
  }
}
