import { RequestContext } from './request-context';

describe('RequestContext', () => {
  it('должен хранить store внутри run()', () => {
    RequestContext.run(
      {
        userId: 42,
        requestId: 'req-1',
        correlationId: 'corr-1',
        ip: '127.0.0.1',
        method: 'GET',
        url: '/users',
      },
      () => {
        expect(RequestContext.getStore()).toEqual({
          userId: 42,
          requestId: 'req-1',
          correlationId: 'corr-1',
          ip: '127.0.0.1',
          method: 'GET',
          url: '/users',
        });
        expect(RequestContext.getUserId()).toBe(42);
        expect(RequestContext.getRequestId()).toBe('req-1');
      },
    );
  });

  it('должен обновлять store через setPartial()', () => {
    RequestContext.run(
      {
        userId: 42,
        requestId: 'req-1',
      },
      () => {
        RequestContext.setPartial({
          correlationId: 'corr-2',
          url: '/posts',
        });

        expect(RequestContext.getStore()).toEqual({
          userId: 42,
          requestId: 'req-1',
          correlationId: 'corr-2',
          url: '/posts',
        });
      },
    );
  });

  it('должен возвращать undefined вне контекста', () => {
    expect(RequestContext.getStore()).toBeUndefined();
    expect(RequestContext.getUserId()).toBeUndefined();
    expect(RequestContext.getRequestId()).toBeUndefined();
  });
});