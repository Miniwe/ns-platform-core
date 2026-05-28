import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/request.type';

/**
 * Извлекает объект пользователя или его конкретное поле из запроса.
 * Использование: @CurrentUser() user: UserEntity или @CurrentUser('id') userId: number
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data ? user?.[data as keyof typeof user] : user;
  },
);
