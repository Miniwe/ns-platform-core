import { RESOLVE_RESOURCE_KEY } from '@/auth';
import { IResourceResolver } from '@/services';
import { Injectable, CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

@Injectable()
export class UUIDResolverGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const uuid = request.params.uuid; // Стандартное имя параметра в URL

    if (!uuid) return true; // Нет UUID в URL — нечего резолвить

    const serviceType = this.reflector.get<Type<IResourceResolver>>(
      RESOLVE_RESOURCE_KEY,
      context.getHandler(),
    );

    if (serviceType) {
      const service = this.moduleRef.get(serviceType, { strict: false });
      // Мапим UUID в числовой ID и кладем в request
      request.internalId = await service.resolveInternalId(uuid);
    }

    return true;
  }
}
