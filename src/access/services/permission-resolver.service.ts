import { Inject, Injectable, Optional } from '@nestjs/common';

import {
  type Permission,
  PERMISSION_CACHE_TAG,
  PermissionSchema,
  uniquePermissions,
} from '@/security';
import { AdvancedCacheService } from '../../services/advanced-cache/advanced-cache.service';
import {
  ACCESS_OPTIONS,
  type AccessOptions,
  DEFAULT_PERMISSION_CACHE_TTL_MS,
  type PermissionCarrier,
  PERMISSION_SOURCE,
  permissionCacheKey,
} from '../constants';
import type { PermissionSource } from '../interfaces';

/**
 * Отдаёт права пользователя для проверки доступа.
 *
 * Решение D-001: права берутся из хранилища, а не из JWT — иначе отзыв прав
 * вступает в силу только после перевыпуска токена. Результат кешируется, и
 * кеш обязан сбрасываться при изменении прав роли или набора ролей
 * пользователя: без этого решение вырождается в задержку длиной в TTL.
 *
 * Если источник прав не зарегистрирован (пакет используется без модуля
 * пользователей), сервис откатывается на права из `request.user.roles`.
 */
@Injectable()
export class PermissionResolverService {
  constructor(
    @Optional()
    @Inject(PERMISSION_SOURCE)
    private readonly source?: PermissionSource,
    @Optional()
    private readonly cache?: AdvancedCacheService,
    @Optional()
    @Inject(ACCESS_OPTIONS)
    private readonly options?: AccessOptions,
  ) {}

  private get ttl(): number {
    return this.options?.permissionCacheTtlMs ?? DEFAULT_PERMISSION_CACHE_TTL_MS;
  }

  /** Права, принесённые токеном. Запасной путь, когда источник не задан. */
  private fromCarrier(user: PermissionCarrier): Permission[] {
    const permissions = (user.roles ?? []).flatMap((role) => role.permissions ?? []);

    return uniquePermissions(permissions.map((permission) => PermissionSchema.parse(permission)));
  }

  async resolve(user: PermissionCarrier): Promise<Permission[]> {
    if (!this.source) {
      return this.fromCarrier(user);
    }

    const key = permissionCacheKey(user.id);
    const cached = await this.cache?.get<Permission[]>(key);

    if (cached) {
      return cached;
    }

    const loaded = await this.source.getUserPermissions(user.id);
    const permissions = uniquePermissions(
      loaded.map((permission) => PermissionSchema.parse(permission)),
    );

    await this.cache?.set(key, permissions, {
      ttl: this.ttl,
      refreshTtl: false,
      tags: [PERMISSION_CACHE_TAG],
    });

    return permissions;
  }

  /** Сбрасывает кеш прав одного пользователя. */
  async invalidateUser(userId: number | string): Promise<void> {
    await this.cache?.delete(permissionCacheKey(userId));
  }

  /**
   * Сбрасывает кеш прав всех пользователей.
   * Вызывается при изменении прав роли — какие именно пользователи ею
   * обладают, вызывающей стороне знать не обязательно.
   */
  async invalidateAll(): Promise<void> {
    await this.cache?.invalidateTag(PERMISSION_CACHE_TAG);
  }
}
