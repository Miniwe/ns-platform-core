export function HasFieldsGuard<T extends object>(
  obj: unknown,
  keys: readonly (keyof T)[],
): obj is T {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const record = obj as Record<PropertyKey, unknown>;
  return keys.every((key) => key in record);
}