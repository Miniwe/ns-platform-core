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

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AdvancedCacheService } from '@/services';
import { HttpRequestLike } from '@/auth';

/**
 * Configuration options for rate-limiting behavior.
 *
 * @interface RateLimitConfig
 * @property {number} windowMs - Time window for HttpRequestLike counting in milliseconds.
 * @property {number} max - Maximum number of allowed Request per window.
 * @property {string} message - Error message for limit violations.
 * @property {boolean} [skipSuccessfulRequest] - Optional flag to ignore successful Request (not implemented yet).
 * @property {boolean} [skipFailedRequest] - Optional flag to ignore failed Request (not implemented yet).
 * @property {(req: HttpRequestLike) => string} [keyGenerator] - Optional function for custom key generation per HttpRequestLike.
 */
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequest?: boolean;
  skipFailedRequest?: boolean;
  keyGenerator?: (req: HttpRequestLike) => string;
}

/**
 * Decorator to configure custom rate-limiting settings for specific route handlers.
 *
 * @param {RateLimitConfig} config - Rate limit configuration to attach via metadata.
 * @returns {MethodDecorator} - A NestJS metadata decorator.
 */
export const RateLimit = (config: RateLimitConfig) => SetMetadata('rateLimit', config);

/**
 * AdvancedThrottleGuard
 *
 * Implements a dynamic and cached rate-limiting mechanism that integrates with
 * NestJS HttpRequestLike lifecycle. Relies on Redis or similar key-value store for
 * HttpRequestLike counting and TTL-based expiration.
 *
 * Key features:
 * - Per-HttpRequestLike key generation (default or custom)
 * - Automatic TTL handling for counters
 * - Adds standard HTTP rate-limit headers:
 *   - `X-RateLimit-Limit`
 *   - `X-RateLimit-Remaining`
 *   - `X-RateLimit-Reset`
 *
 * Throws `HttpException` with `429 Too Many Request` status if limit is exceeded.
 */
@Injectable()
export class AdvancedThrottleGuard implements CanActivate {
  /** Default limiting window: 15 minutes */
  private readonly defaultWindowMs = 15 * 60 * 1000;

  /** Default maximum number of Request allowed within the window */
  private readonly defaultMax = 100;

  constructor(
    private reflector: Reflector,
    private cacheService: AdvancedCacheService,
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
   * @param {HttpRequestLike} request - Current incoming HTTP HttpRequestLike.
   * @param {(req: HttpRequestLike) => string} [keyGenerator] - Optional custom key generator.
   * @returns {string} Unique key used for counting Request.
   */
  private generateKey(request: HttpRequestLike, keyGenerator?: (req: HttpRequestLike) => string): string {
    if (keyGenerator) {
      return `ratelimit:${keyGenerator(request)}`;
    }

    const ip = request.ip || request?.connection?.remoteAddress || 'unknown';
    // TODO: remove `@ts-ignore` when HttpRequestLike.user typing is standardized
    // @ts-ignore
    const userId = request.user?.id || 'anonymous';

    return `ratelimit:${ip}:${userId}:${request.route?.path || 'unknown'}`;
  }
}
