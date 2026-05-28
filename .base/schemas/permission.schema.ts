import { z } from 'zod';
import { PermissionResourceSchema, PermissionActionSchema } from '@/shared/constants/enums';

export const PermissionSchema = z
  .object({
    resource: PermissionResourceSchema,
    action: PermissionActionSchema,
  })
  .describe('Объект разрешения на действие с ресурсом');
