import { z } from 'zod';

export const JwtPayloadSchema = z.object({
  sub: z.number().int().describe('Internal user ID'),
  uuid: z.uuid().describe('Public user UUID'),
  email: z.email().describe('User email'),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
