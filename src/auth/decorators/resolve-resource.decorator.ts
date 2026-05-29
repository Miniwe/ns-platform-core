import { SetMetadata } from '@nestjs/common';
import { RESOLVE_RESOURCE_KEY } from '../constants';

export const ResolveResource = (resource: string) =>
  SetMetadata(RESOLVE_RESOURCE_KEY, resource);