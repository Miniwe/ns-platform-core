import type { ExecutionContext } from '@nestjs/common';
import type { ModuleRef, Reflector } from '@nestjs/core';
import { UUIDResolverGuard } from './uuid-resolver.guard';

describe('UUIDResolverGuard', () => {
  const makeContext = (request: Record<string, unknown>): ExecutionContext =>
    ({
      getHandler: () => 'handler',
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  let reflector: jest.Mocked<Reflector>;
  let moduleRef: jest.Mocked<ModuleRef>;
  let guard: UUIDResolverGuard;

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    moduleRef = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ModuleRef>;

    guard = new UUIDResolverGuard(reflector, moduleRef);
  });

  it('returns true when uuid is missing', async () => {
    const request = { params: {} };
    const ctx = makeContext(request);

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(reflector.get).not.toHaveBeenCalled();
    expect(moduleRef.get).not.toHaveBeenCalled();
  });

  it('returns true when resolver metadata is missing', async () => {
    const request = {
      params: { uuid: '550e8400-e29b-41d4-a716-446655440000' },
    };
    const ctx = makeContext(request);

    reflector.get.mockReturnValue(undefined);

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(reflector.get).toHaveBeenCalledWith(expect.anything(), ctx.getHandler());
    expect(moduleRef.get).not.toHaveBeenCalled();
    expect((request as any).internalId).toBeUndefined();
  });

  it('resolves internalId through resolver service', async () => {
    class FakeResolverService {
      resolveInternalId = jest.fn().mockResolvedValue(42);
    }

    const resolver = new FakeResolverService();
    const request = {
      params: { uuid: '550e8400-e29b-41d4-a716-446655440000' },
    };
    const ctx = makeContext(request);

    reflector.get.mockReturnValue(FakeResolverService);
    moduleRef.get.mockReturnValue(resolver as any);

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(moduleRef.get).toHaveBeenCalledWith(FakeResolverService, { strict: false });
    expect(resolver.resolveInternalId).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000',
    );
    expect((request as any).internalId).toBe(42);
  });
});