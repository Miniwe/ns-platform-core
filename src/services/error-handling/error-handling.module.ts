import { Global, Module } from '@nestjs/common';
import { ErrorHandlingService } from './error-handling.service';

@Global() // Делаем глобальным, чтобы не импортировать в каждый модуль вручную
@Module({
  providers: [ErrorHandlingService],
  exports: [ErrorHandlingService],
})
export class ErrorHandlingModule {}
