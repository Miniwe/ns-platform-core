import { EntityManager } from 'typeorm';
import { AppContext } from '@/context';

export class TransactionContext {
  private static fallbackManager: EntityManager | null = null;

  static setFallbackManager(manager: EntityManager): void {
    this.fallbackManager = manager;
  }

  static hasActiveTransaction(): boolean {
    return !!AppContext.getStore()?.transactionManager;
  }

  static getManager(): EntityManager {
    const txManager = AppContext.getStore()?.transactionManager;
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

  static run<T>(manager: EntityManager, fn: () => Promise<T>): Promise<T> {
    const current = AppContext.getStore() ?? {};

    return AppContext.run(
      {
        ...current,
        transactionManager: manager,
      },
      fn,
    );
  }
}