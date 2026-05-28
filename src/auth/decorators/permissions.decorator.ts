import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';
import { PERMISSIONS_KEY } from '../constants';

export const PermissionRequirementSchema = z.object({
  resource: z.string().min(1).describe('Permission resource'),
  action: z.string().min(1).describe('Permission action'),
});

export type PermissionRequirement = z.infer<typeof PermissionRequirementSchema>;

export const Permissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
