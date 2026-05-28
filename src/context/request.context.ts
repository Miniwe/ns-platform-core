import { AsyncLocalStorage } from 'async_hooks';

export type RequestContextStore = {
  userId?: number;
  requestId?: string;
  correlationId?: string;
  ip?: string;
  method?: string;
  url?: string;
};

export class RequestContext {
  private static storage = new AsyncLocalStorage<RequestContextStore>();

  static run<T>(store: RequestContextStore, callback: () => T): T {
    return this.storage.run(store, callback);
  }

  static getStore(): RequestContextStore | undefined {
    return this.storage.getStore();
  }

  static getUserId(): number | undefined {
    return this.storage.getStore()?.userId;
  }

  static getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  static setPartial(patch: Partial<RequestContextStore>): void {
    const store = this.storage.getStore();
    if (!store) return;
    Object.assign(store, patch);
  }
}