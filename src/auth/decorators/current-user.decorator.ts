import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '@/security';

export const currentUserFactory = (
  data: string | undefined,
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  const user = request.user;

  return data ? user?.[data as keyof typeof user] : user;
};

export const CurrentUser = createParamDecorator(currentUserFactory);