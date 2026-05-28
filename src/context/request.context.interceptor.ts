import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';
import { RequestContext } from './request.context';
import type { HttpRequestLike } from '@/auth/types';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<HttpRequestLike>();

    const requestId =
      this.getHeader(request, 'x-request-id') ??
      this.getHeader(request, 'x-correlation-id') ??
      randomUUID();

    const store = {
      userId: this.extractUserId(request),
      requestId,
      correlationId: this.getHeader(request, 'x-correlation-id') ?? requestId,
      ip: request.ip,
      method: request.method,
      url: request.url,
    };

    return new Observable((subscriber) => {
      RequestContext.run(store, () => {
        const subscription = next.handle().subscribe(subscriber);
        return () => subscription.unsubscribe();
      });
    });
  }

  private extractUserId(request: HttpRequestLike): number | undefined {
    const raw =
      request.user && typeof request.user === 'object'
        ? (request.user as Record<string, unknown>).id
        : undefined;

    return typeof raw === 'number' ? raw : undefined;
  }

  private getHeader(request: HttpRequestLike, name: string): string | undefined {
    const headers = request.headers;
    if (!headers || typeof headers !== 'object') return undefined;

    const value = (headers as Record<string, unknown>)[name];
    return typeof value === 'string' ? value : undefined;
  }
}
