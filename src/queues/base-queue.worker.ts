import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

/**
 * Базовый класс для всех воркеров очередей.
 * T - тип данных задачи (Job Data), по умолчанию безопасный объект
 * R - тип возвращаемого результата
 */
export abstract class BaseQueueWorker<
  T extends Record<string, unknown> = Record<string, unknown>,
  R = void,
> extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Основной метод бизнес-логики, который должны реализовать наследники.
   */
  abstract handle(job: Job<T>): Promise<R>;

  /**
   * Точка входа BullMQ.
   * @param job Объект задачи
   * @param _token Токен владения (не используется, помечен для ESLint)
   */
  async process(job: Job<T>, _token?: string): Promise<R> {
    const startTime = Date.now();

    this.logger.log(`[Job ${job.id}] Processing ${job.name}. Data: ${JSON.stringify(job.data)}`);

    try {
      const result = await this.handle(job);
      const duration = Date.now() - startTime;

      this.logger.log(`[Job ${job.id}] Success. Duration: ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(
        `[Job ${job.id}] Failed after ${duration}ms. Error: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );

      // Выбрасываем ошибку повторно, чтобы BullMQ применил стратегию ретраев (attempts)
      throw error;
    }
  }
}
