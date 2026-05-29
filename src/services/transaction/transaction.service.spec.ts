import { RequestContext } from '@/context';
import { TransactionContext } from './transaction-context.service';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  afterEach(() => {
    (TransactionContext as any).fallbackManager = null;
  });

  it('должен выполнять fn внутри dataSource.transaction()', async () => {
    const manager = {
      query: jest.fn(),
    };

    const dataSource = {
      transaction: jest.fn(async (cb: (manager: any) => Promise<unknown>) => cb(manager)),
    } as any;

    const service = new TransactionService(dataSource);

    const result = await service.runInTransaction(async () => 'ok');

    expect(result).toBe('ok');
    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
  });

  it('должен переиспользовать текущую транзакцию, если она уже активна', async () => {
    const activeManager = { name: 'active' } as any;
    const dataSource = {
      transaction: jest.fn(),
    } as any;

    const service = new TransactionService(dataSource);

    const result = await TransactionContext.run(activeManager, async () => {
      return service.runInTransaction(async () => 'nested-ok');
    });

    expect(result).toBe('nested-ok');
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('должен брать userId из RequestContext для autoLockByUser', async () => {
    const manager = {
      query: jest.fn().mockResolvedValue(undefined),
    };

    const dataSource = {
      transaction: jest.fn(async (cb: (manager: any) => Promise<unknown>) => cb(manager)),
    } as any;

    const service = new TransactionService(dataSource);

    await RequestContext.run({ userId: 7 }, async () => {
      await service.runInTransaction(async () => 'ok', { autoLockByUser: true });
    });

    expect(manager.query).toHaveBeenCalledWith(
      'SELECT pg_advisory_xact_lock($1)',
      [7],
    );
  });

  it('должен бросать ошибку без userId при autoLockByUser', async () => {
    const manager = {
      query: jest.fn(),
    };

    const dataSource = {
      transaction: jest.fn(async (cb: (manager: any) => Promise<unknown>) => cb(manager)),
    } as any;

    const service = new TransactionService(dataSource);

    await expect(
      RequestContext.run({}, async () =>
        service.runInTransaction(async () => 'ok', { autoLockByUser: true }),
      ),
    ).rejects.toThrow('RequestContext userId is required for autoLockByUser');
  });

  it('должен сохранять RequestContext внутри транзакции', async () => {
    const manager = {
      query: jest.fn().mockResolvedValue(undefined),
    };

    const dataSource = {
      transaction: jest.fn(async (cb: (manager: any) => Promise<unknown>) => cb(manager)),
    } as any;

    const service = new TransactionService(dataSource);

    await RequestContext.run(
      {
        userId: 99,
        requestId: 'req-99',
      },
      async () => {
        await service.runInTransaction(async () => {
          expect(RequestContext.getUserId()).toBe(99);
          expect(RequestContext.getRequestId()).toBe('req-99');
          expect(TransactionContext.getManager()).toBe(manager);
          return 'ok';
        });
      },
    );
  });
});