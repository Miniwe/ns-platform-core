/**
 * @fileoverview
 * Advanced rate-limiting (throttling) guard implementation for NestJS.
 *
 * This guard provides flexible HttpRequestLike limiting per route or per user/IP key,
 * using a caching backend via `AdvancedCacheService`. It supports setting
 * per-handler configurations using the `@RateLimit()` decorator.
 *
 * Typical use case:
 * ```
 * @RateLimit({
 *   windowMs: 60_000,
 *   max: 10,
 *   message: 'Too many login attempts.'
 * })
 * @UseGuards(AdvancedThrottleGuard)
 * @Post('login')
 * handleLogin() { ... }
 * ```
 */

import { Injectable, CanActivate, ExecutionContext,
         HttpException, HttpStatus, Inject, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { HttpRequestLike } from '@/security';
import { THROTTLE_MODULE_OPTIONS, type ThrottleModuleOptions } from './types'; // вынесем интерфейс
import { AdvancedCacheService } from '../advanced-cache/advanced-cache.service';
import { RateLimitConfig } from './domain'; // вынесем интерфейс

@Injectable()
export class AdvancedThrottleGuard implements CanActivate {
  private readonly defaultWindowMs = 15 * 60 * 1000;
  private readonly defaultMax = 100;

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: AdvancedCacheService,
    @Optional() @Inject(THROTTLE_MODULE_OPTIONS)
    private readonly options: ThrottleModuleOptions = {},
  ) {}

  /**
   * Main entry point for NestJS guard pipeline.
   *
   * Checks and increments the current counter for a specific key (user/IP/route),
   * enforces HttpRequestLike limits, and sets appropriate response headers.
   *
   * @param {ExecutionContext} context - NestJS HttpRequestLike execution context.
   * @returns {Promise<boolean>} True if HttpRequestLike is allowed, otherwise throws an exception.
   * @throws {HttpException} `429 Too Many Request` when the defined limit is exceeded.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitConfig = this.reflector.get<RateLimitConfig>('rateLimit', context.getHandler());

    // Skip if handler has no rate-limit configuration
    if (!rateLimitConfig) return true;

    const HttpRequestLike = context.switchToHttp().getRequest<HttpRequestLike>();
    const response = context.switchToHttp().getResponse();

    const windowMs = rateLimitConfig.windowMs || this.defaultWindowMs;
    const max = rateLimitConfig.max || this.defaultMax;
    const key = this.generateKey(HttpRequestLike, rateLimitConfig.keyGenerator);

    // Increment HttpRequestLike count in cache
    const current = await this.cacheService.incr(key);

    // Initialize TTL if first HttpRequestLike in window
    if (current === 1) {
      await this.cacheService.expire(key, Math.ceil(windowMs / 1000));
    }

    const ttl = await this.cacheService.ttl(key);
    const resetTime = new Date(Date.now() + ttl * 1000);

    // Set rate-limit headers
    response.setHeader('X-RateLimit-Limit', max);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
    response.setHeader('X-RateLimit-Reset', resetTime.toISOString());

    // Enforce limit
    if (current > max) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: rateLimitConfig.message || 'Too many Request',
          error: 'Too Many Request',
        },
        HttpStatus.TOO_MANY_REQUESTS,
        {
          cause: { limit: max, current, resetTime },
        },
      );
    }

    return true;
  }

  /**
   * Generates cache key for rate-limiting entries.
   *
   * Default behavior combines client IP, authenticated user ID (if any),
   * and route path. The logic can be overridden via `keyGenerator` function.
   *
   * @param {HttpRequestLike} HttpRequestLike - Current incoming HTTP HttpRequestLike.
   * @param {(req: HttpRequestLike) => string} [keyGenerator] - Optional custom key generator.
   * @returns {string} Unique key used for counting Request.
   */
  private generateKey(HttpRequestLike: HttpRequestLike, keyGenerator?: (req: HttpRequestLike) => string): string {
    if (keyGenerator) {
      return `ratelimit:${keyGenerator(HttpRequestLike)}`;
    }

    const ip = HttpRequestLike.ip || HttpRequestLike?.connection?.remoteAddress || 'unknown';

    const userId = HttpRequestLike.user?.id || 'anonymous';

    return `ratelimit:${ip}:${userId}:${HttpRequestLike.route?.path || 'unknown'}`;
  }
}
