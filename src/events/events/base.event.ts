import { randomBytes } from 'node:crypto'; // Встроенный модуль Node.js, 100% совместим с Jest
import { BaseEvents } from '../constansts';

export class DefaultEvent {
  constructor(
    public readonly userId: number,
    public readonly context: unknown,
    public readonly eventId: string = randomBytes(16).toString('base64url'),
    public readonly occurredAt: Date = new Date(),
  ) {}

  toString() {
    return `[${BaseEvents.DEFAULT}] occured at ${this.occurredAt.toISOString()} for User(id): ${this.userId} `;
  }
}

declare module '../event-emitter' {
  interface AppEvents {
    [BaseEvents.DEFAULT]: DefaultEvent;
  }
}
