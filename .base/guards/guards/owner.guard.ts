import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = parseInt(request.user?.id, 10);

    if (request.user.id !== userId) {
      throw new ForbiddenException('У вас нет доступа к чужому профилю');
    }

    return true;
  }
}
