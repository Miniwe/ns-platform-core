import { z } from 'zod';
import { RoleSchema } from './role.schema';

export const RequestUserSchema = z
  .object({
    id: z.number().int().describe('Internal user ID'),
    uuid: z.uuid().describe('Public user UUID'),
    roles: z.array(RoleSchema).default([]).describe('Resolved user roles'),
  })
  .describe('Authenticated request user');

export type RequestUser = z.infer<typeof RequestUserSchema>;
