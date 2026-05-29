import { AppContext, AppContextStore } from './app.context';

export type RequestContextStore = Omit<AppContextStore, 'transactionManager'>;

export class RequestContext {
  static run<T>(store: RequestContextStore, callback: () => T): T {
    const current = AppContext.getStore() ?? {};
    return AppContext.run({ ...current, ...store }, callback);
  }

  static getStore(): RequestContextStore | undefined {
    const store = AppContext.getStore();
    if (!store) return undefined;

    const { transactionManager, ...requestStore } = store;
    return requestStore;
  }

  static getUserId(): number | undefined {
    return AppContext.getStore()?.userId;
  }

  static getRequestId(): string | undefined {
    return AppContext.getStore()?.requestId;
  }

  static setPartial(patch: Partial<RequestContextStore>): void {
    AppContext.setPartial(patch);
  }
}