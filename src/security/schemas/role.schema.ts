import { z } from 'zod';
import { PermissionSchema } from './permission.schema';

/**
 * Не enum — роли являются данными/артефактами системы, а не фиксированным core-списком.
 * Это снимает лишнюю opinionated жёсткость с external package.
 */
export const RoleNameSchema = z.string().min(1).describe('Unique system role name');

export const RoleSchema = z
  .object({
    name: RoleNameSchema,
    description: z.string().default('').describe('Human-readable role description'),
    permissions: z.array(PermissionSchema).default([]).describe('Role permissions'),
  })
  .describe('Resolved role');

export type RoleName = z.infer<typeof RoleNameSchema>;
export type Role = z.infer<typeof RoleSchema>;
