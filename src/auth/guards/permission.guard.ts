import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { z } from 'zod';
import { PERMISSIONS_KEY } from '../constants';
import type { AuthenticatedRequest } from '../types';
import { PermissionRequirementSchema } from '../decorators';

const PermissionItemSchema = z.object({
  resource: z.string().min(1),
  action: z.string().min(1),
});

const RoleSchema = z.object({
  name: z.string(),
  permissions: z.array(PermissionItemSchema).default([]),
});

const PermissionAwareUserSchema = z.object({
  roles: z.array(RoleSchema).default([]),
  permissions: z.array(PermissionItemSchema).default([]),
});

type PermissionRequirement = z.infer<typeof PermissionRequirementSchema>;
type PermissionAwareUser = z.infer<typeof PermissionAwareUserSchema>;

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<PermissionRequirement[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest<PermissionAwareUser>>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authenticated user not found');
    }

    const parsedUser = PermissionAwareUserSchema.safeParse(user);

    if (!parsedUser.success) {
      throw new ForbiddenException('User permissions are not available');
    }

    const flattenedRolePermissions = parsedUser.data.roles.flatMap(
      (role) => role.permissions ?? [],
    );

    const directPermissions = parsedUser.data.permissions ?? [];

    const allPermissions = [...flattenedRolePermissions, ...directPermissions];

    const hasAllRequiredPermissions = requiredPermissions.every((required) =>
      allPermissions.some(
        (permission) =>
          permission.resource === required.resource &&
          permission.action === required.action,
      ),
    );

    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}