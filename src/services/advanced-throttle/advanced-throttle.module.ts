import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdvancedThrottleGuard } from './advanced-throttle.guard';
import { ThrottleModuleOptions, THROTTLE_MODULE_OPTIONS, NestModuleImport } from './types';

export type ThrottleModuleAsyncOptions = {
  useFactory: (...args: any[]) => Promise<ThrottleModuleOptions> | ThrottleModuleOptions;
  inject?: any[];
  imports?: NestModuleImport[];
};

@Module({})
export class AdvancedThrottleModule {
  static register(options: ThrottleModuleOptions = {}): DynamicModule {
    return {
      module: AdvancedThrottleModule,
      imports: options.imports ?? [],
      providers: [
        { provide: THROTTLE_MODULE_OPTIONS, useValue: options },
        Reflector,
        AdvancedThrottleGuard,
      ],
      exports: [AdvancedThrottleGuard],
    };
  }

  static registerAsync(asyncOptions: ThrottleModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: THROTTLE_MODULE_OPTIONS,
      useFactory: asyncOptions.useFactory,
      inject: asyncOptions.inject ?? [],
    };

    return {
      module: AdvancedThrottleModule,
      imports: asyncOptions.imports ?? [],
      providers: [optionsProvider, Reflector, AdvancedThrottleGuard],
      exports: [AdvancedThrottleGuard],
    };
  }
}