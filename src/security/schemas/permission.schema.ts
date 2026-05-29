import { z } from 'zod';

export const PermissionResourceSchema = z
  .string()
  .min(1)
  .describe('Permission resource identifier');

export const PermissionActionSchema = z
  .string()
  .min(1)
  .describe('Permission action identifier');

export const PermissionSchema = z
  .object({
    resource: PermissionResourceSchema,
    action: PermissionActionSchema,
  })
  .describe('Permission descriptor');

export type Permission = z.infer<typeof PermissionSchema>;