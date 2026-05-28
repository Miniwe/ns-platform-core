import { SetMetadata, Type } from '@nestjs/common';
import { IResourceResolver } from '../interfaces/resource-resolver.interface';

export const RESOLVE_RESOURCE_KEY = 'resolve_resource';
/**
 * @ResolveResource(MatchService)
 * Указывает Guard-у, какой сервис использовать для маппинга UUID -> ID
 */
export const ResolveResource = (service: Type<IResourceResolver>) =>
  SetMetadata(RESOLVE_RESOURCE_KEY, service);

// Параметрический декоратор для удобства в контроллере
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const InternalId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.internalId; // Числовой ID, подложенный Guard-ом
});
