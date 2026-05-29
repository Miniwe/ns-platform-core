import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorHandlingService } from '@/services';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorService: ErrorHandlingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = this.errorService.extractFromHost(host);
    this.errorService.handleError(exception, context, false);

    const response = host.switchToHttp().getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal Server Error';
    let code = this.getErrorCodeByStatus(status);
    let errors: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const typed = res as {
          message?: string | string[];
          code?: string;
          errors?: Record<string, unknown>;
        };

        message = typed.message ?? exception.message;
        code = typed.code ?? this.getErrorCodeByStatus(status);
        errors = typed.errors;
      } else {
        message = exception.message;
      }
    }

    response.status(status).send({
      statusCode: status,
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