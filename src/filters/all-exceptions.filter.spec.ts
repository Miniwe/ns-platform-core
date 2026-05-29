import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  const makeHost = () => {
    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status,
        }),
      }),
    } as unknown as ArgumentsHost;

    return { host, status, send };
  };

  const errorService = {
    extractFromHost: jest.fn(() => ({ requestId: 'req-1' })),
    handleError: jest.fn(),
  } as any;

  let filter: AllExceptionsFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new AllExceptionsFilter(errorService);
  });

  it('мапит HttpException со строковым response', () => {
    const { host, status, send } = makeHost();
    const exception = new BadRequestException('Validation failed');

    filter.catch(exception, host);

    expect(errorService.extractFromHost).toHaveBeenCalledWith(host);
    expect(errorService.handleError).toHaveBeenCalledWith(
      exception,
      { requestId: 'req-1' },
      false,
    );
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(send).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Validation failed',
      code: 'BAD_REQUEST',
    });
  });

  it('мапит HttpException с object response и сохраняет code/errors', () => {
    const { host, status, send } = makeHost();

    const exception = new HttpException(
      {
        message: ['email is invalid'],
        code: 'VALIDATION_ERROR',
        errors: { email: ['invalid'] },
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(send).toHaveBeenCalledWith({
      statusCode: 422,
      message: ['email is invalid'],
      code: 'VALIDATION_ERROR',
      errors: { email: ['invalid'] },
    });
  });

  it('для неизвестной ошибки отдаёт 500 и INTERNAL_ERROR', () => {
    const { host, status, send } = makeHost();
    const exception = new Error('Unexpected fail');

    filter.catch(exception, host);

    expect(errorService.extractFromHost).toHaveBeenCalledWith(host);
    expect(errorService.handleError).toHaveBeenCalledWith(
      exception,
      { requestId: 'req-1' },
      false,
    );
    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(send).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    });
  });
});