import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export type NestModuleImport =
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference;

export interface ThrottleModuleOptions {
  imports?: NestModuleImport[];
  // future: globalWindowMs?: number;
  // future: globalMax?: number;
  // future: skipPaths?: string[];
}

export const THROTTLE_MODULE_OPTIONS = Symbol('THROTTLE_MODULE_OPTIONS');