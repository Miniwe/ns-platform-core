import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Этот интерфейс расширяется другими пакетами
export interface AppEvents {
  // Ключ: Название события (строка или enum) -> Значение: КЛАСС события
}

@Injectable()
export class TypedEventEmitter {
  constructor(private readonly emitter: EventEmitter2) {}

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]) {
    return this.emitter.emit(event as string, payload);
  }

  on<K extends keyof AppEvents>(event: K, listener: (payload: AppEvents[K]) => void) {
    this.emitter.on(event as string, listener);
  }
}