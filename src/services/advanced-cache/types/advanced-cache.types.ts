import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Provider, Type } from '@nestjs/common/interfaces';

export type AdvancedCacheModuleOptions = {
  host: string;
  port: number;
  password?: string;
  db?: number;
  namespace?: string;
  ttl?: number;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  lazyConnect?: boolean;
};

export interface AdvancedCacheOptionsFactory {
  createAdvancedCacheOptions():
    | Promise<AdvancedCacheModuleOptions>
    | AdvancedCacheModuleOptions;
}

export interface AdvancedCacheModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AdvancedCacheOptionsFactory>;
  useClass?: Type<AdvancedCacheOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<AdvancedCacheModuleOptions> | AdvancedCacheModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}