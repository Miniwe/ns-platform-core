import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';
import { PERMISSIONS_KEY, PermissionSchema } from '@/security';

export const PermissionRequirementSchema = z.array(PermissionSchema).min(1);
export type PermissionRequirement = z.infer<typeof PermissionRequirementSchema>;

export function RequirePermissions(...permissions: PermissionRequirement) {
  const validated = PermissionRequirementSchema.parse(permissions);
  return SetMetadata(PERMISSIONS_KEY, validated);
}