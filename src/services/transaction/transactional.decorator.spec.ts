import { Transactional } from './transactional.decorator';

describe('Transactional decorator', () => {
  it('оборачивает вызов метода в transactionService.runInTransaction', async () => {
    const runInTransaction = jest.fn(async (cb: () => Promise<unknown>) => cb());

    class TestService {
      transactionService = { runInTransaction };

      @Transactional()
      async execute(value: string): Promise<string> {
        return `done:${value}`;
      }
    }

    const service = new TestService();
    const result = await service.execute('x');

    expect(result).toBe('done:x');
    expect(runInTransaction).toHaveBeenCalledTimes(1);
    expect(runInTransaction).toHaveBeenCalledWith(expect.any(Function), {
      autoLockByUser: undefined,
    });
  });

  it('пробрасывает lockByUser в autoLockByUser', async () => {
    const runInTransaction = jest.fn(async (cb: () => Promise<unknown>) => cb());

    class TestService {
      transactionService = { runInTransaction };

      @Transactional({ lockByUser: true })
      async execute(): Promise<string> {
        return 'ok';
      }
    }

    const service = new TestService();
    await service.execute();

    expect(runInTransaction).toHaveBeenCalledWith(expect.any(Function), {
      autoLockByUser: true,
    });
  });

  it('бросает ошибку если transactionService отсутствует', async () => {
    class BrokenService {
      @Transactional()
      async execute(): Promise<string> {
        return 'ok';
      }
    }

    const service = new BrokenService();

    await expect(service.execute()).rejects.toThrow(
      'TransactionService must be injected as "transactionService" in BrokenService',
    );
  });
});