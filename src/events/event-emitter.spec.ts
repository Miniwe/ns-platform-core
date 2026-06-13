import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypedEventEmitter } from './event-emitter';
import { DefaultEvent } from './events/base.event';
import { BaseEvents } from './constansts';

describe('TypedEventEmitter', () => {
  let typedEventEmitter: TypedEventEmitter;
  let eventEmitter2: EventEmitter2;

  beforeEach(async () => {
    // Создаем тестовый модуль NestJS с моком для оригинального EventEmitter2
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypedEventEmitter,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(), // Мокаем метод emit
          },
        },
      ],
    }).compile();

    typedEventEmitter = module.get<TypedEventEmitter>(TypedEventEmitter);
    eventEmitter2 = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(typedEventEmitter).toBeDefined();
  });

  describe('emit', () => {
    it('should successfully forward the event and payload to EventEmitter2', () => {
      // Arrange
      const eventName = BaseEvents.DEFAULT;
      const eventPayload = new DefaultEvent({ userId: 1 });

      // Настраиваем мок так, чтобы он возвращал true (как оригинальный эмиттер)
      jest.spyOn(eventEmitter2, 'emit').mockReturnValue(true);

      // Act
      const result = typedEventEmitter.emit(eventName, eventPayload);

      // Assert
      expect(result).toBe(true);
      expect(eventEmitter2.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitter2.emit).toHaveBeenCalledWith(eventName, eventPayload);
    });
  });
});

describe('DefaultEvent', () => {
  it('should initialize with default values if not provided', () => {
    // Arrange
    const context = { action: 'test' };
    const beforeCreation = new Date();

    // Act
    const event = new DefaultEvent(context);

    // Assert
    expect(event.context).toEqual(context);
    expect(event.eventId).toBeDefined();
    expect(typeof event.eventId).toBe('string');
    expect(event.eventId.length).toBeGreaterThan(0); // Проверяем, что nanoid отработал
    expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
  });

  it('should allow overriding default values in constructor', () => {
    // Arrange
    const context = 'custom-context';
    const customId = 'custom-nanoid-123';
    const customDate = new Date('2025-01-01T00:00:00.000Z');

    // Act
    const event = new DefaultEvent(context, customId, customDate);

    // Assert
    expect(event.context).toBe(context);
    expect(event.eventId).toBe(customId);
    expect(event.occurredAt).toBe(customDate);
  });

  describe('toString', () => {
    it('should return formatted string with event name and ISO date', () => {
      // Arrange
      const context = {};
      const customDate = new Date('2026-06-13T12:00:00.000Z');
      const event = new DefaultEvent(context, 'id', customDate);

      // Act
      const result = event.toString();

      // Assert
      expect(result).toBe('[DEFAULT] occured at 2026-06-13T12:00:00.000Z');
    });
  });
});
