// 1. Компонент, который создает текст
class MessageGenerator {
  create(user: string): string {
    return `[TS Test]: Привет, ${user}! Интеграция работает.`;
  }
}

// 2. Компонент, который принимает первый класс и выводит сообщение
class LoggerService {
  constructor(private generator: MessageGenerator) {}

  logUser(name: string): boolean {
    const text = this.generator.create(name);
    console.log(text); // Вывод в консоль Jest
    return true;
  }
}

// 3. Интеграционный тест Jest
describe('Simple TS Integration', () => {
  it('должен связать два класса и вывести текст', () => {
    // Соединяем компоненты в единую систему
    const generator = new MessageGenerator();
    const logger = new LoggerService(generator);

    // Запускаем их совместную работу
    const status = logger.logUser('TypeScript');

    // Проверяем результат
    expect(status).toBe(true);
  });
});
