import { z } from 'zod';

/**
 * TODO Implement Roles
 */
export const RequestUserSchema = z.object({
  id: z.number().int().describe('Internal user ID'),
  uuid: z.uuid().describe('Public user UUID'),
  email: z.email().describe('User email'),
  username: z.string().optional().describe('Username'),
  firstName: z.string().nullish().describe('First name'),
  isVerified: z.boolean().default(false).describe('Email or account verification flag'),
  roles: z.array(z.any()).default([]).describe('Resolved roles attached by auth strategy'),
});

export type RequestUser = z.infer<typeof RequestUserSchema>;
