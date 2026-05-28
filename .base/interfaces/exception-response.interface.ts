export interface ExceptionResponse {
  message: string;
  code: string;
  errors?: Record<string, unknown> | undefined;
}
