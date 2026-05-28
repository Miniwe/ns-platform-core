import { TransactionService } from '../services/transaction.service';

/**
 * Опции для настройки поведения транзакции.
 */
export interface TransactionalOptions {
  /** Включить эксклюзивную блокировку pg_advisory_xact_lock по userId из текущего контекста запроса */
  lockByUser?: boolean;
}

/**
 * Интерфейс описывает структуру класса, в котором может быть использован декоратор.
 * Класс обязан иметь свойство transactionService.
 */
interface TransactionalHost {
  transactionService: TransactionService;
}

export function Transactional(options?: TransactionalOptions) {
  return function <T extends TransactionalHost, A extends unknown[], R>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => Promise<R>>,
  ): TypedPropertyDescriptor<(...args: A) => Promise<R>> | void {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      return descriptor;
    }

    // Используем 'this: T' для явного указания типа контекста выполнения
    descriptor.value = async function (this: T, ...args: A): Promise<R> {
      if (!this.transactionService) {
        throw new Error(
          `TransactionService must be injected as "transactionService" in ${this.constructor.name}`,
        );
      }

      // Передаем опции (включая autoLockByUser) в обновленный метод runInTransaction
      return this.transactionService.runInTransaction(() => originalMethod.apply(this, args), {
        autoLockByUser: options?.lockByUser,
      });
    };

    return descriptor;
  };
}
