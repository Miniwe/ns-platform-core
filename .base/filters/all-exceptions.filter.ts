import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorHandlingService } from '@/shared/services';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorService: ErrorHandlingService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = this.errorService.extractFromHost(host);

    // Логируем ошибку во внутреннюю систему мониторинга бэкенда
    this.errorService.handleError(exception, context, false);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Формируем строгий StandardErrorDto ответ для фронтенда
    let message: string | string[] = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let errors: Record<string, unknown> | undefined = undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message ?? exception.message;
        code = (res as any).code ?? this.getErrorCodeByStatus(status);
        errors = (res as any).errors;
      }
      code ??= this.getErrorCodeByStatus(status);
    }

    response.status(status).send({
      message,
      code,
      ...(errors ? { errors } : {}),
    });
  }

  private getErrorCodeByStatus(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'VALIDATION_ERROR';
      default:
        return 'INTERNAL_ERROR';
    }
  }
}
