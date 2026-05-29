type AsyncMaybe = void | Promise<void>;

type ClosableLike =
  | { close: () => AsyncMaybe }
  | { quit: () => AsyncMaybe }
  | { disconnect: () => AsyncMaybe }
  | { destroy: () => AsyncMaybe }
  | { end: (destroy?: boolean) => AsyncMaybe };

type ResourceKind =
  | 'nest-app'
  | 'nest-module'
  | 'typeorm-datasource'
  | 'redis'
  | 'bull-queue'
  | 'bullmq-worker'
  | 'bullmq-scheduler'
  | 'server'
  | 'custom';

type RegisteredResource = {
  name: string;
  kind: ResourceKind;
  resource: ClosableLike | null | undefined;
};

declare global {
   
  var __TEST_RESOURCES__: RegisteredResource[] | undefined;
}

const getRegistry = (): RegisteredResource[] => {
  if (!global.__TEST_RESOURCES__) {
    global.__TEST_RESOURCES__ = [];
  }
  return global.__TEST_RESOURCES__;
};

export const registerTestResource = (
  name: string,
  kind: ResourceKind,
  resource: ClosableLike | null | undefined,
): void => {
  if (!resource) return;
  getRegistry().push({ name, kind, resource });
};

const safeInvoke = async (name: string, fn: () => AsyncMaybe): Promise<void> => {
  try {
    await fn();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // не валим тесты на cleanup-ошибке, но логируем
     
    console.warn(`[jest-cleanup] failed to close ${name}: ${message}`);
  }
};

const closeResource = async ({ name, kind, resource }: RegisteredResource): Promise<void> => {
  if (!resource) return;

  // приоритет закрытия по типу ресурса
  if ('close' in resource && typeof resource.close === 'function') {
    await safeInvoke(`${kind}:${name}.close`, () => resource.close());
    return;
  }

  if ('quit' in resource && typeof resource.quit === 'function') {
    await safeInvoke(`${kind}:${name}.quit`, () => resource.quit());
    return;
  }

  if ('destroy' in resource && typeof resource.destroy === 'function') {
    await safeInvoke(`${kind}:${name}.destroy`, () => resource.destroy());
    return;
  }

  if ('disconnect' in resource && typeof resource.disconnect === 'function') {
    await safeInvoke(`${kind}:${name}.disconnect`, () => resource.disconnect());
    return;
  }

  if ('end' in resource && typeof resource.end === 'function') {
    await safeInvoke(`${kind}:${name}.end`, () => resource.end(true));
  }
};

const cleanupRegisteredResources = async (): Promise<void> => {
  const registry = getRegistry();

  // LIFO: закрываем в обратном порядке создания
  while (registry.length > 0) {
    const item = registry.pop();
    if (item) {
      await closeResource(item);
    }
  }
};

afterEach(async () => {
  await cleanupRegisteredResources();
});

afterAll(async () => {
  await cleanupRegisteredResources();
});