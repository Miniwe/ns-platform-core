import { JobsOptions, Queue } from 'bullmq';

export abstract class BaseQueueProducer<T = unknown> {
  constructor(protected readonly queue: Queue) {}

  async addJob(name: string, data: T, opts?: JobsOptions) {
    return this.queue.add(name, data, opts);
  }
}
