import { Injectable, Logger, HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { ErrorContext } from './error-context.schema';

@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger('ErrorHandling');

  /**
   * Основной метод обработки ошибок.
   * @param error - Объект ошибки
   * @param context - Дополнительный контекст
   * @param rethrow - Нужно ли пробрасывать ошибку дальше (для фильтров)
   */
  handleError(error: any, context?: ErrorContext, rethrow: boolean = true): never | void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const report = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      stack,
      context: this.sanitizeContext(context || {}),
    };

    // Логируем структурированный JSON (удобно для ELK/Loki)
    this.logger.error(JSON.stringify(report));

    if (rethrow) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Если это неизвестная системная ошибка — оборачиваем в 500
      throw new HttpException(
        { message: 'Internal Server Error', code: 'INTERNAL_ERROR' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  logWarn(message: string, context?: ErrorContext): void {
    this.logger.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'warn',
        message,
        context: this.sanitizeContext(context || {}),
      }),
    );
  }

  logInfo(message: string, context?: ErrorContext): void {
    this.logger.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        context: this.sanitizeContext(context || {}),
      }),
    );
  }

  /**
   * Извлечение данных из HTTP запроса для контекста
   */
  extractFromHost(host: ArgumentsHost): ErrorContext {
    const request = host.switchToHttp().getRequest();
    if (!request) return {};

    return {
      userId: request.user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      method: request.method,
      url: request.url,
      data: {
        query: request.query,
        params: request.params,
        body: this.sanitizeData(request.body),
      },
    };
  }

  /**
   * Очистка контекста целиком
   */
  private sanitizeContext(context: ErrorContext): ErrorContext {
    if (context.data) {
      context.data = this.sanitizeData(context.data);
    }
    return context;
  }

  /**
   * Рекурсивная очистка чувствительных полей (password, token и т.д.)
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'jwt', 'authorization'];
    const sanitized = { ...data };

    for (const key in sanitized) {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    }

    return sanitized;
  }
}
