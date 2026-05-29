import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdvancedThrottleGuard } from './advanced-throttle.guard';
import { THROTTLE_MODULE_OPTIONS } from './types';
import { RateLimitConfig } from './domain';
import { AdvancedCacheService } from '../advanced-cache';

// --- Mock factory ---
const makeCacheService = (incrValue = 1, ttlValue = 60) => ({
  incr: jest.fn().mockResolvedValue(incrValue),
  expire: jest.fn().mockResolvedValue(true),
  ttl: jest.fn().mockResolvedValue(ttlValue),
});

const makeContext = (
  config: RateLimitConfig | undefined,
  overrides: Partial<{ ip: string; userId: string; path: string }> = {},
): ExecutionContext => {
  const setHeader = jest.fn();
  return {
    getHandler: () => jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        ip: overrides.ip ?? '127.0.0.1',
        user: overrides.userId ? { id: overrides.userId } : undefined,
        route: { path: overrides.path ?? '/test' },
        connection: {},
      }),
      getResponse: () => ({ setHeader }),
    }),
    _reflectorValue: config, // используем ниже
    _setHeader: setHeader,
  } as unknown as ExecutionContext;
};

// --- Tests ---
describe('AdvancedThrottleGuard', () => {
  let guard: AdvancedThrottleGuard;
  let reflector: Reflector;

  const defaultConfig: RateLimitConfig = { windowMs: 60_000, max: 5, message: 'Too many' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvancedThrottleGuard,
        {
          provide: Reflector,
          useValue: { get: jest.fn() },
        },
        {
          provide: AdvancedCacheService,
          useValue: makeCacheService(),
        },
        {
          provide: THROTTLE_MODULE_OPTIONS,
          useValue: {},
        },
      ],
    }).compile();

    guard = module.get(AdvancedThrottleGuard);
    reflector = module.get(Reflector);
  });

  describe('when no RateLimit metadata', () => {
    it('should pass through (return true)', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);
      const ctx = makeContext(undefined);
      await expect(guard.canActivate(ctx)).resolves.toBe(true);
    });
  });

  describe('when within limit', () => {
    it('should allow request and set headers', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(defaultConfig);
      const cacheService = makeCacheService(1, 55); // 1st request
      // пересоздаём guard с нужным mock
      guard = new (AdvancedThrottleGuard as any)(reflector, cacheService, {});

      const ctx = makeContext(defaultConfig);
      const result = await guard.canActivate(ctx);

      expect(result).toBe(true);
      expect(cacheService.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:'));
      // expire вызывается только при первом запросе (current === 1)
      expect(cacheService.expire).toHaveBeenCalledWith(expect.any(String), 60);

      const { _setHeader: setHeader } = ctx as any;
      expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 5);
      expect(setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 4);
    });
  });

  describe('when limit exceeded', () => {
    it('should throw 429 HttpException', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(defaultConfig);
      const cacheService = makeCacheService(6, 30); // current > max (6 > 5)
      guard = new (AdvancedThrottleGuard as any)(reflector, cacheService, {});

      const ctx = makeContext(defaultConfig);
      await expect(guard.canActivate(ctx)).rejects.toThrow(HttpException);
      await expect(guard.canActivate(ctx)).rejects.toMatchObject({
        status: 429,
      });
    });

    it('should use custom message from config', async () => {
      const config: RateLimitConfig = { ...defaultConfig, message: 'Custom limit message', max: 2 };
      jest.spyOn(reflector, 'get').mockReturnValue(config);
      const cacheService = makeCacheService(3, 10);
      guard = new (AdvancedThrottleGuard as any)(reflector, cacheService, {});

      await expect(guard.canActivate(makeContext(config))).rejects.toMatchObject({
        response: { message: 'Custom limit message' },
      });
    });
  });

  describe('key generation', () => {
    it('should use custom keyGenerator if provided', async () => {
      const keyGenerator = jest.fn().mockReturnValue('custom-key');
      const config: RateLimitConfig = { ...defaultConfig, keyGenerator };
      jest.spyOn(reflector, 'get').mockReturnValue(config);
      const cacheService = makeCacheService(1, 60);
      guard = new (AdvancedThrottleGuard as any)(reflector, cacheService, {});

      await guard.canActivate(makeContext(config));

      expect(cacheService.incr).toHaveBeenCalledWith('ratelimit:custom-key');
    });

    it('should not call expire on subsequent requests (current > 1)', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(defaultConfig);
      const cacheService = makeCacheService(3, 40); // 3rd request
      guard = new (AdvancedThrottleGuard as any)(reflector, cacheService, {});

      await guard.canActivate(makeContext(defaultConfig));
      expect(cacheService.expire).not.toHaveBeenCalled();
    });
  });
});
