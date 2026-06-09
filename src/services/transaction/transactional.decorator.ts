import { TransactionService } from './transaction.service';

/**
 * Опции для настройки поведения транзакции.
 */
export interface TransactionalOptions {
  /** Включить эксклюзивную блокировку pg_advisory_xact_lock по userId из текущего контекста запроса */
  lockByUser?: boolean;
  serviceKey?: string;
}

export function Transactional(options?: TransactionalOptions) {
  return function <T extends Record<string, any>, A extends unknown[], R>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => Promise<R>>,
  ) {
    const originalMethod = descriptor.value;
    if (!originalMethod) return descriptor;

    descriptor.value = async function (this: T, ...args: A): Promise<R> {
      const serviceKey = options?.serviceKey ?? 'transactionService';
      const transactionService = this[serviceKey] as TransactionService | undefined;

      if (!transactionService) {
        throw new Error(
          `TransactionService must be injected as "${serviceKey}" in ${this.constructor.name}`,
        );
      }

      return transactionService.runInTransaction(() => originalMethod.apply(this, args), {
        autoLockByUser: options?.lockByUser,
      });
    };

    return descriptor;
  };
}
