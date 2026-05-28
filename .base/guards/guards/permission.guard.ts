import {
  NotFoundException,
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AdvancedCacheService } from '@/shared/services/advanced-cache/advanced-cache.service';
import { UsersService } from '@/users/users.service';

import { Role } from '../entities/role.entity';
import { PermissionDto } from '../dto/permission.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private cacheService: AdvancedCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<PermissionDto[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // Кеширование permissions в Redis на 5 минут
    const cacheKey = `user:${userId}:permissions-1`;
    let permissions: PermissionDto[] | undefined = await this.cacheService.get(cacheKey);

    // Особая роль "developer" пропускает все проверки
    if (request.user && request.user.roles.find((role: Role) => role.name === 'developer')) {
      return true;
    }

    if (!permissions) {
      // Метод загрузки permissions пользователя (реализуйте в UsersService)
      permissions = await this.loadPermissions(userId);
      await this.cacheService.set(cacheKey, permissions, { ttl: 300 }); // 300 сек = 5 минут
    }

    if (!permissions) {
      throw new NotFoundException('Права пользователя не найдены');
    }

    const requiredPermStrings = requiredPermissions.map(p => `${p.resource}:${p.action}`);
    const userPermStrings = permissions.map(p => `${p.resource}:${p.action}`);

    const hasPermission = requiredPermStrings.some(rp => userPermStrings.includes(rp));

    if (!hasPermission) {
      throw new ForbiddenException('Недостаточно прав для выполнения этой операции');
    }

    return true;
  }

  private async loadPermissions(userId: number): Promise<PermissionDto[]> {
    // Загрузка разрешений пользователя из базы с JOIN для ролей и permissions
    const user = await this.usersService.findOneWithPermissions(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Собираем все permissions из ролей пользователя
    const perms = user.roles
      .flatMap((role: any) => role.permissions)
      .map((p: any) => ({ resource: p.resource, action: p.action }));

    return perms;
  }
}
