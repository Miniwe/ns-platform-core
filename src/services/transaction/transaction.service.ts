import { Injectable } from '@nestjs/common';
import { RequestContext } from '@/context';
import { DataSource } from 'typeorm';
import { TransactionContext } from './transaction-context.service';

@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  async runInTransaction<T>(
    fn: () => Promise<T>,
    options?: { autoLockByUser?: boolean },
  ): Promise<T> {
    if (TransactionContext.hasActiveTransaction()) {
      return fn();
    }

    return this.dataSource.transaction(async (manager) => {
      return TransactionContext.run(manager, async () => {
        if (options?.autoLockByUser) {
          const userId = RequestContext.getUserId();
          if (!userId) {
            throw new Error('RequestContext userId is required for autoLockByUser');
          }

          await manager.query('SELECT pg_advisory_xact_lock($1)', [userId]);
        }

        return fn();
      });
    });
  }
}
