import { z } from 'zod';
import { RequestUserSchema } from '@/security';

export const AuthTokensSchema = z.object({
  accessToken: z.string().describe('JWT access token'),
  refreshToken: z.string().optional().describe('JWT refresh token'),
  tokenType: z.literal('Bearer').describe('Token type'),
  expiresIn: z.number().int().positive().describe('Access token lifetime in seconds'),
  refreshExpiresIn: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Refresh token lifetime in seconds'),
});

export const AuthSessionSchema = AuthTokensSchema.extend({
  user: RequestUserSchema.describe('Authenticated user'),
});

export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;
