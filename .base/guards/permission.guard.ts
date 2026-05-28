import { z } from 'zod';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '@/shared/decorators';
import { AuthenticatedRequest } from '@/shared/types';
import { PermissionSchema } from '@/shared/schemas';

import { RoleEntity } from '@/modules/roles';

type PermissionRequirement = z.infer<typeof PermissionSchema>;

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('PermissionGuard:', { context });
    // 1. Извлекаем требуемые разрешения из метаданных (декоратора)
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionRequirement[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('PermissionGuard:', { requiredPermissions });

    // Если разрешений не требуется — пропускаем
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    console.log('PermissionGuard:', { user });

    if (!user || !user.roles) {
      throw new ForbiddenException('Доступ запрещен: роль не определена');
    }

    // 👑 DEVELOPER SUPERUSER BYPASS (Режим Бога)
    // Разработчик обходит любые проверки ограничений и пермишенов
    const isDeveloper = user.roles?.some((role: RoleEntity) => role.name === 'DEVELOPER');
    if (isDeveloper) {
      return true;
    }

    // 3. Собираем плоский список всех прав из всех ролей пользователя
    const userPermissions = user.roles.flatMap((role) => role.permissions);

    console.log('PermissionGuard:', { userPermissions });

    // 4. Проверяем наличие КАЖДОГО требуемого разрешения
    const hasAllRequiredPermissions = requiredPermissions.every((required) =>
      userPermissions.some(
        (userPerm) =>
          userPerm.resource === required.resource && userPerm.action === required.action,
      ),
    );

    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Недостаточно прав для выполнения данной операции');
    }

    console.log('PermissionGuard:', 'TRUE');

    return true;
  }
}
