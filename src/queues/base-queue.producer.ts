import { Queue } from 'bullmq';

export abstract class BaseQueueProducer<T = any> {
  constructor(protected readonly queue: Queue) {}

  async addJob(name: string, data: T, opts?: any) {
    return this.queue.add(name, data, opts);
  }
}
