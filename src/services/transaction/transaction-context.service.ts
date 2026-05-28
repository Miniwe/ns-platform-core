import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export class TransactionContext {
  private static storage = new AsyncLocalStorage<EntityManager>();

  // Базовый менеджер (глобальный), используемый вне транзакционных контекстов (для обычных SELECT)
  private static fallbackManager: EntityManager | null = null;

  /**
   * Инициализирует глобальный менеджер при старте приложения
   */
  static setFallbackManager(manager: EntityManager): void {
    this.fallbackManager = manager;
  }

  /**
   * Проверяет, запущена ли трансляция в текущем контексте (потоке)
   */
  static hasActiveTransaction(): boolean {
    return !!this.storage.getStore();
  }

  /**
   * Возвращает текущий активный менеджер транзакции.
   * Если метод вызван вне @Transactional(), возвращает обычный менеджер для безопасных чтений.
   */
  static getManager(): EntityManager {
    const txManager = this.storage.getStore();
    if (txManager) {
      return txManager;
    }

    if (this.fallbackManager) {
      return this.fallbackManager;
    }

    throw new Error(
      'TransactionContext: Менеджер не инициализирован. ' +
        'Убедитесь, что вызван TransactionContext.setFallbackManager() при старте приложения.',
    );
  }

  /**
   * Запускает функцию внутри изолированного контекста хранилища
   */
  static run<T>(manager: EntityManager, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(manager, fn);
  }
}
