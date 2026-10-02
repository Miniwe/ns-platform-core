import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { z } from 'zod';

import {
  ANY_PERMISSIONS_KEY,
  type AuthenticatedRequest,
  type Permission,
  PERMISSIONS_KEY,
  permissionToString,
  RoleSchema,
} from '@/security';
import {
  ACCESS_OPTIONS,
  type AccessOptions,
  DEFAULT_SUPER_ROLES,
  type PermissionCarrier,
} from '../constants';
import { PermissionResolverService } from '../services';
import type { PermissionRequirement } from '../decorators';

const PermissionCarrierUserSchema = z.object({
  id: z.union([z.number(), z.string()]),
  roles: z.array(RoleSchema).default([]),
});

type PermissionCarrierUser = z.infer<typeof PermissionCarrierUserSchema>;

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Optional()
    private readonly resolver?: PermissionResolverService,
    @Optional()
    @Inject(ACCESS_OPTIONS)
    private readonly options?: AccessOptions,
  ) {}

  private get superRoles(): string[] {
    return (this.options?.superRoles ?? [...DEFAULT_SUPER_ROLES]).map((name) =>
      name.trim().toUpperCase(),
    );
  }

  /**
   * Решение D-002: роль обслуживания проходит любую проверку прав.
   * Имя роли берётся из настроек модуля, а не пишется строкой по коду —
   * иначе переименование роли молча снимет обход.
   */
  private isSuperRole(user: PermissionCarrier): boolean {
    const superRoles = this.superRoles;

    return (user.roles ?? []).some((role) =>
      superRoles.includes(String(role.name).trim().toUpperCase()),
    );
  }

  private readMetadata(context: ExecutionContext, key: symbol): PermissionRequirement {
    return (
      this.reflector.getAllAndOverride<PermissionRequirement>(key, [
        context.getHandler(),
        context.getClass(),
      ]) ?? []
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireAll = this.readMetadata(context, PERMISSIONS_KEY);
    const requireAny = this.readMetadata(context, ANY_PERMISSIONS_KEY);

    if (requireAll.length === 0 && requireAny.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest<PermissionCarrierUser>>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authenticated user not found');
    }

    const parsedUser = PermissionCarrierUserSchema.safeParse(user);

    if (!parsedUser.success) {
      throw new ForbiddenException('User roles are not available');
    }

    if (this.isSuperRole(parsedUser.data)) {
      return true;
    }

    const granted = await this.resolvePermissions(parsedUser.data);
    const grantedKeys = new Set(granted.map(permissionToString));

    const hasAll = requireAll.every((required) => grantedKeys.has(permissionToString(required)));
    const hasAny =
      requireAny.length === 0 ||
      requireAny.some((required) => grantedKeys.has(permissionToString(required)));

    if (!hasAll || !hasAny) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  /**
   * Без зарегистрированного резолвера guard остаётся работоспособным и
   * проверяет права, принесённые токеном, — так пакет можно подключить без
   * модуля пользователей.
   */
  private async resolvePermissions(user: PermissionCarrierUser): Promise<Permission[]> {
    if (this.resolver) {
      return this.resolver.resolve(user);
    }

    return (user.roles ?? []).flatMap((role) => role.permissions ?? []);
  }
}
