import { of } from 'rxjs';
import { randomUUID } from 'crypto';
import { RequestContextInterceptor } from './request-context.interceptor';
import { RequestContext } from './request-context';
import type { ExecutionContext, CallHandler } from '@nestjs/common';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'generated-request-id'),
}));

describe('RequestContextInterceptor', () => {
  let interceptor: RequestContextInterceptor;

  beforeEach(() => {
    interceptor = new RequestContextInterceptor();
    jest.spyOn(RequestContext, 'run').mockImplementation((store, cb) => cb());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const makeExecutionContext = (request: Record<string, unknown>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  const makeNext = (): CallHandler => ({
    handle: () => of('ok'),
  });

  it('использует x-request-id как requestId и correlationId fallback-ом', (done) => {
    const ctx = makeExecutionContext({
      headers: {
        'x-request-id': 'req-123',
      },
      user: { id: 42 },
      ip: '127.0.0.1',
      method: 'GET',
      url: '/users',
    });

    interceptor.intercept(ctx, makeNext()).subscribe({
      next: (value) => {
        expect(value).toBe('ok');
        expect(RequestContext.run).toHaveBeenCalledWith(
          {
            userId: 42,
            requestId: 'req-123',
            correlationId: 'req-123',
            ip: '127.0.0.1',
            method: 'GET',
            url: '/users',
          },
          expect.any(Function),
        );
        done();
      },
      error: done,
    });
  });

  it('если x-request-id отсутствует — использует x-correlation-id', (done) => {
    const ctx = makeExecutionContext({
      headers: {
        'x-correlation-id': 'corr-999',
      },
      user: { id: '42' },
      ip: '10.0.0.1',
      method: 'POST',
      url: '/orders',
    });

    interceptor.intercept(ctx, makeNext()).subscribe({
      next: () => {
        expect(RequestContext.run).toHaveBeenCalledWith(
          {
            userId: undefined,
            requestId: 'corr-999',
            correlationId: 'corr-999',
            ip: '10.0.0.1',
            method: 'POST',
            url: '/orders',
          },
          expect.any(Function),
        );
        done();
      },
      error: done,
    });
  });

  it('если заголовков нет — использует randomUUID()', (done) => {
    const ctx = makeExecutionContext({
      headers: {},
      user: {},
      ip: '192.168.0.1',
      method: 'PATCH',
      url: '/profile',
    });

    interceptor.intercept(ctx, makeNext()).subscribe({
      next: () => {
        expect(randomUUID).toHaveBeenCalled();
        expect(RequestContext.run).toHaveBeenCalledWith(
          {
            userId: undefined,
            requestId: 'generated-request-id',
            correlationId: 'generated-request-id',
            ip: '192.168.0.1',
            method: 'PATCH',
            url: '/profile',
          },
          expect.any(Function),
        );
        done();
      },
      error: done,
    });
  });
});