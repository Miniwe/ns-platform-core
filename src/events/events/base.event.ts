import { randomBytes } from 'node:crypto'; // Встроенный модуль Node.js, 100% совместим с Jest
import { BaseEvents } from '../constansts';
import { Optional } from '@nestjs/common';

export class DefaultEvent {
  constructor(
    public readonly context: unknown,
    @Optional() public readonly eventId: string = randomBytes(16).toString('base64url'),
    @Optional() public readonly occurredAt: Date = new Date(),
  ) {}

  toString() {
    return `[${BaseEvents.DEFAULT}] occured at ${this.occurredAt.toISOString()}`;
  }
}

// РАСШИРЕНИЕ КАРТЫ: связываем enum-строку и наш класс
declare module '../event-emitter' {
  interface CoreEvents {
    [BaseEvents.DEFAULT]: DefaultEvent;
  }
}
