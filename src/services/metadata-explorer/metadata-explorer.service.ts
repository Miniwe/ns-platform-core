import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import 'reflect-metadata';

import {
  ANY_PERMISSIONS_KEY,
  type Permission,
  PERMISSION_CACHE_TAG,
  PERMISSIONS_KEY,
  permissionToString,
  uniquePermissions,
} from '@/security';
import { AdvancedCacheService } from '../advanced-cache/advanced-cache.service';

/** Где объявлено право: контроллер и метод-обработчик. */
export type PermissionUsage = {
  controller: string;
  method: string;
  /** `all` — требуются все права набора, `any` — достаточно одного. */
  mode: 'all' | 'any';
};

/** Право и все места, где оно объявлено. */
export type PermissionCatalogEntry = Permission & {
  key: string;
  usages: PermissionUsage[];
};

/** Каталог прав, сгруппированный по ресурсу. */
export type PermissionCatalogGroup = {
  resource: string;
  permissions: PermissionCatalogEntry[];
};

type MetadataHit = {
  controller: string;
  method: string;
  metadata: Permission[];
};

const CATALOG_CACHE_KEY = 'permissions:catalog';

/** Час в миллисекундах — `AdvancedCacheService` принимает TTL именно в них. */
const CATALOG_CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Собирает каталог прав из метаданных контроллеров.
 *
 * Смысл каталога: интерфейс управления ролями показывает не придуманный
 * руками список прав, а то, что действительно объявлено в коде. Из того же
 * каталога берутся права, выдаваемые ролям при установке.
 */
@Injectable()
export class MetadataExplorerService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly cacheService: AdvancedCacheService,
  ) {}

  findAllMetadata(key: string | symbol): MetadataHit[] {
    const controllers = this.discoveryService.getControllers();
    const results: MetadataHit[] = [];

    controllers.forEach(({ instance, metatype }) => {
      if (!instance || !metatype) return;
      const prototype = Object.getPrototypeOf(instance);
      const methods = Object.getOwnPropertyNames(prototype).filter((m) => m !== 'constructor');

      methods.forEach((method) => {
        const metadata = Reflect.getMetadata(key, instance[method]) as Permission[] | undefined;
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

  /**
   * Плоский список прав без дублей.
   * Одно и то же право, объявленное в нескольких контроллерах, встречается
   * в каталоге один раз — иначе интерфейс показывает его повторно.
   */
  async getAllPermissions(): Promise<Permission[]> {
    const catalog = await this.getPermissionCatalog();

    return catalog.flatMap((group) =>
      group.permissions.map(({ resource, action }) => ({ resource, action })),
    );
  }

  /** Каталог с группировкой по ресурсу и указанием мест объявления. */
  async getPermissionCatalog(): Promise<PermissionCatalogGroup[]> {
    return this.cacheService.getWithFallback(
      CATALOG_CACHE_KEY,
      async () => this.buildCatalog(),
      {
        ttl: CATALOG_CACHE_TTL_MS,
        refreshTtl: false,
        tags: [PERMISSION_CACHE_TAG],
      },
    );
  }

  /** Сбрасывает кеш каталога — нужен после горячей перезагрузки модулей. */
  async invalidateCatalog(): Promise<void> {
    await this.cacheService.delete(CATALOG_CACHE_KEY);
  }

  private buildCatalog(): PermissionCatalogGroup[] {
    const hits: Array<MetadataHit & { mode: PermissionUsage['mode'] }> = [
      ...this.findAllMetadata(PERMISSIONS_KEY).map((hit) => ({ ...hit, mode: 'all' as const })),
      ...this.findAllMetadata(ANY_PERMISSIONS_KEY).map((hit) => ({ ...hit, mode: 'any' as const })),
    ];

    const byKey = new Map<string, PermissionCatalogEntry>();

    for (const hit of hits) {
      for (const permission of uniquePermissions(hit.metadata)) {
        const key = permissionToString(permission);
        const entry = byKey.get(key) ?? { ...permission, key, usages: [] };

        entry.usages.push({ controller: hit.controller, method: hit.method, mode: hit.mode });
        byKey.set(key, entry);
      }
    }

    const groups = new Map<string, PermissionCatalogGroup>();

    for (const entry of byKey.values()) {
      const group = groups.get(entry.resource) ?? { resource: entry.resource, permissions: [] };

      group.permissions.push(entry);
      groups.set(entry.resource, group);
    }

    return [...groups.values()]
      .map((group) => ({
        resource: group.resource,
        permissions: group.permissions.sort((a, b) => a.action.localeCompare(b.action)),
      }))
      .sort((a, b) => a.resource.localeCompare(b.resource));
  }
}
