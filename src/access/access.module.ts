import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';

import { ACCESS_OPTIONS, type AccessOptions, PERMISSION_SOURCE } from './constants';
import { PermissionResolverService } from './services';
import { OwnerGuard, PermissionGuard, RoleGuard } from './guards';
import type { PermissionSource } from './interfaces';

export type AccessModuleOptions = AccessOptions & {
  /**
   * Источник прав пользователя. Обычно — сервис пользователей приложения.
   * Если не задан, guard проверяет права, принесённые токеном.
   */
  permissionSource?: Type<PermissionSource>;
  /** Модули, из которых доступен `permissionSource`. */
  imports?: DynamicModule['imports'];
};

/**
 * Модуль доступа: настройки проверки прав, резолвер и guard-ы.
 *
 * Глобальный, потому что guard-ы подключаются декоратором `@UseGuards` в
 * произвольных модулях приложения и должны получать свои зависимости без
 * импорта модуля в каждом из них.
 */
@Global()
@Module({})
export class AccessModule {
  static forRoot(options: AccessModuleOptions = {}): DynamicModule {
    const { permissionSource, imports = [], ...accessOptions } = options;

    const providers: Provider[] = [
      { provide: ACCESS_OPTIONS, useValue: accessOptions },
      PermissionResolverService,
      PermissionGuard,
      RoleGuard,
      OwnerGuard,
    ];

    if (permissionSource) {
      providers.push({ provide: PERMISSION_SOURCE, useExisting: permissionSource });
    }

    return {
      module: AccessModule,
      imports,
      providers,
      exports: [
        ACCESS_OPTIONS,
        PermissionResolverService,
        PermissionGuard,
        RoleGuard,
        OwnerGuard,
        ...(permissionSource ? [PERMISSION_SOURCE] : []),
      ],
    };
  }
}
