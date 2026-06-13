import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypedEventEmitter } from './event-emitter';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  providers: [TypedEventEmitter],
  exports: [TypedEventEmitter],
})
export class TypedEventEmitterModule {
  static forRoot(): DynamicModule {
    return {
      module: TypedEventEmitterModule,
      imports: [EventEmitterModule.forRoot()],
      providers: [TypedEventEmitter],
      exports: [TypedEventEmitter],
      global: true,
    };
  }
}
