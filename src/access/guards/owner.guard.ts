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

    const currentUserId = request.user?.id;

    if (!currentUserId) {
      throw new ForbiddenException('Пользователь не аутентифицирован');
    }

    const targetParam = request.params?.[this.paramName];

    // Если параметра нет в URL — значит эндпоинт работает с "собственным" ресурсом
    // (например /users/profile). Разрешаем — JWT уже верифицирован.
    if (targetParam === undefined || targetParam === null || targetParam === '') {
      return true;
    }

    // Есть параметр — проверяем владение
    if (String(currentUserId) !== String(targetParam)) {
      throw new ForbiddenException('У вас нет доступа к чужому ресурсу');
    }

    return true;
  }
}
