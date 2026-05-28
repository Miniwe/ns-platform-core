import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/shared/decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Мы используем дженерик TUser, чтобы соответствовать IAuthGuard,
   * но по умолчанию он равен нашему T.
   * Вместо any используем unknown для служебных параметров.
   */
  override handleRequest<TUser>(err: Error | null, user: TUser | null): TUser {
    // Если есть ошибка или пользователь не найден (токен невалиден)
    if (err || !user) {
      throw err || new UnauthorizedException('Необходима авторизация');
    }

    // Возвращаем пользователя.
    // Поскольку наша JwtStrategy гарантирует возврат TUser,
    // здесь user будет соответствовать контракту.
    return user;
  }
}
