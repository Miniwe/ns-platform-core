import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { ACCESS_OPTIONS, type AccessOptions } from './constants';
import { PermissionResolverService } from './services';
import { OwnerGuard, PermissionGuard, RoleGuard } from './guards';

export type AccessModuleOptions = AccessOptions;

/**
 * Модуль доступа: настройки проверки прав, резолвер и guard-ы.
 *
 * Глобальный, потому что guard-ы подключаются декоратором `@UseGuards` в
 * произвольных модулях приложения и должны получать свои зависимости без
 * импорта модуля в каждом из них.
 *
 * Источник прав сюда не импортируется: встречный импорт модуля пользователей
 * в глобальный модуль подвешивает инициализацию контейнера. Вместо этого
 * владелец источника регистрирует его у себя под токеном `PERMISSION_SOURCE`
 * (так делает `UserModule` в `ns-platform-base`), а `PermissionResolverService`
 * находит его лениво через `ModuleRef`.
 */
@Global()
@Module({})
export class AccessModule {
  static forRoot(options: AccessModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [
      { provide: ACCESS_OPTIONS, useValue: options },
      PermissionResolverService,
      PermissionGuard,
      RoleGuard,
      OwnerGuard,
    ];

    return {
      module: AccessModule,
      providers,
      exports: [ACCESS_OPTIONS, PermissionResolverService, PermissionGuard, RoleGuard, OwnerGuard],
    };
  }
}
