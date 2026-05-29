export default class MockDataLoader<K, V> {
  constructor(
    private readonly batchLoadFn: (keys: readonly K[]) => PromiseLike<ReadonlyArray<V>>,
  ) {}

  async load(key: K): Promise<V> {
    const result = await this.batchLoadFn([key]);
    return result[0] as V;
  }

  async loadMany(keys: readonly K[]): Promise<ReadonlyArray<V>> {
    return this.batchLoadFn(keys);
  }

  clear(): this {
    return this;
  }

  prime(): this {
    return this;
  }
}