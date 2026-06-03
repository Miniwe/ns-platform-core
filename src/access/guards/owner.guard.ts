import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Optional,
} from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(@Optional() private readonly paramName = 'id') {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { id?: number | string };
      params?: Record<string, string | undefined>;
    }>();

    const currentUserId = String(request.user?.id ?? '');
    const targetUserId = String(request.params?.[this.paramName] ?? '');

    if (!currentUserId || !targetUserId || currentUserId !== targetUserId) {
      throw new ForbiddenException('У вас нет доступа к чужому ресурсу');
    }

    return true;
  }
}