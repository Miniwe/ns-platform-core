import { string, stringbool, z } from 'zod';

export const PermissionSchema = z
  .object({
    resource: z.string().describe('Resource'),
    action: z.string().describe('Resuorce allowed action'),
  })
  .describe('Объект разрешения на действие с ресурсом');
