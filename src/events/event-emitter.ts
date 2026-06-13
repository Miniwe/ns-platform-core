import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Этот интерфейс расширяется другими пакетами
export interface CoreEvents {
  // Ключ: Название события (строка или enum) -> Значение: КЛАСС события
}

@Injectable()
export class TypedEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  // Обратите внимание: payload теперь строго соответствует инстансу класса из карты
  emit<K extends keyof CoreEvents>(event: K, payload: CoreEvents[K]): boolean {
    return this.eventEmitter.emit(event as string, payload);
  }
}
