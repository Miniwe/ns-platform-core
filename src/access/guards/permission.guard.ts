import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { z } from 'zod';

import { type AuthenticatedRequest, PERMISSIONS_KEY, PermissionSchema, RoleSchema } from '@/security';
import { PermissionRequirementSchema } from '../decorators';

const PermissionCarrierUserSchema = z.object({
  roles: z.array(RoleSchema).default([]),
});

type PermissionRequirement = z.infer<typeof PermissionRequirementSchema>;
type PermissionCarrierUser = z.infer<typeof PermissionCarrierUserSchema>;

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionRequirement>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest<PermissionCarrierUser>>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authenticated user not found');
    }

    const parsedUser = PermissionCarrierUserSchema.safeParse(user);

    if (!parsedUser.success) {
      throw new ForbiddenException('User roles are not available');
    }

    const rolePermissions = parsedUser.data.roles.flatMap((role) => role.permissions ?? []);

    const normalizedPermissions = z.array(PermissionSchema).parse(rolePermissions);

    const hasAllRequiredPermissions = requiredPermissions.every((required) =>
      normalizedPermissions.some(
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