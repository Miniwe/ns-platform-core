import { RequestContext } from '@/context';
import { TransactionContext } from './transaction-context.service';

describe('TransactionContext', () => {
  afterEach(() => {
    (TransactionContext as any).fallbackManager = null;
  });

  it('должен использовать fallbackManager вне транзакции', () => {
    const fallbackManager = { name: 'fallback' } as any;

    TransactionContext.setFallbackManager(fallbackManager);

    expect(TransactionContext.hasActiveTransaction()).toBe(false);
    expect(TransactionContext.getManager()).toBe(fallbackManager);
  });

  it('должен бросать ошибку, если менеджер не инициализирован', () => {
    expect(() => TransactionContext.getManager()).toThrow(
      'TransactionContext: Менеджер не инициализирован.',
    );
  });

  it('должен активировать transaction manager внутри run()', async () => {
    const manager = { name: 'tx' } as any;

    await TransactionContext.run(manager, async () => {
      expect(TransactionContext.hasActiveTransaction()).toBe(true);
      expect(TransactionContext.getManager()).toBe(manager);
    });

    expect(TransactionContext.hasActiveTransaction()).toBe(false);
  });

  it('не должен терять RequestContext внутри transaction context', async () => {
    const manager = { name: 'tx' } as any;

    await RequestContext.run(
      {
        userId: 77,
        requestId: 'req-77',
        correlationId: 'corr-77',
      },
      async () => {
        await TransactionContext.run(manager, async () => {
          expect(RequestContext.getUserId()).toBe(77);
          expect(RequestContext.getRequestId()).toBe('req-77');
          expect(TransactionContext.getManager()).toBe(manager);
        });
      },
    );
  });
});