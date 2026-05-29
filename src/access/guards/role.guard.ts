import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { z } from 'zod';

import { type AuthenticatedRequest, ROLES_KEY, RoleSchema } from '@/security';
import { RoleRequirementSchema } from '../decorators';

const RoleAwareUserSchema = z.object({
  roles: z.array(RoleSchema).default([]),
});

type RoleRequirement = z.infer<typeof RoleRequirementSchema>;
type RoleAwareUser = z.infer<typeof RoleAwareUserSchema>;

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleRequirement>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest<RoleAwareUser>>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authenticated user not found');
    }

    const parsedUser = RoleAwareUserSchema.safeParse(user);

    if (!parsedUser.success) {
      throw new ForbiddenException('User roles are not available');
    }

    const userRoleNames = parsedUser.data.roles.map((role) => role.name);
    const hasRequiredRole = requiredRoles.some((roleName) => userRoleNames.includes(roleName));

    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient roles');
    }

    return true;
  }
}