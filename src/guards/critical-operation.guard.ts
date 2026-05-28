import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CriticalOperationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Отсутствует токен авторизации');
    }

    const token = authHeader.split(' ')[1];

    // Декодируем токен без верификации подписи, так как
    // этот Guard будет использоваться после JwtAuthGuard
    const decoded = this.jwtService.decode(token) as { iat?: number } | null;

    if (!decoded || !decoded.iat) {
      throw new UnauthorizedException('Не удалось определить время начала сессии.');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenAgeSeconds = currentTimestamp - decoded.iat;

    // Проверяем, превышает ли возраст токена 1 час (3600 секунд)
    if (tokenAgeSeconds > 3600) {
      throw new UnauthorizedException(
        'В целях безопасности для выполнения этой критически важной операции требуется свежая сессия. Пожалуйста, выполните повторный вход.',
      );
    }

    return true;
  }
}
