import { AsyncLocalStorage } from 'async_hooks';
import type { EntityManager } from 'typeorm';

export type AppContextStore = {
  userId?: number;
  requestId?: string;
  correlationId?: string;
  ip?: string;
  method?: string;
  url?: string;
  transactionManager?: EntityManager;
};

export class AppContext {
  private static storage = new AsyncLocalStorage<AppContextStore>();

  static run<T>(store: AppContextStore, callback: () => T): T {
    return this.storage.run(store, callback);
  }

  static getStore(): AppContextStore | undefined {
    return this.storage.getStore();
  }

  static setPartial(patch: Partial<AppContextStore>): void {
    const store = this.storage.getStore();
    if (!store) return;

    Object.assign(store, patch);
  }
}