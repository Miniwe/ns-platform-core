import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';
import { ROLES_KEY } from '@/security';
import { RoleNameSchema } from '@/security';

export const RoleRequirementSchema = z.array(RoleNameSchema).min(1);
export type RoleRequirement = z.infer<typeof RoleRequirementSchema>;

export function RequireRoles(...roles: RoleRequirement) {
  const validated = RoleRequirementSchema.parse(roles);
  return SetMetadata(ROLES_KEY, validated);
}
