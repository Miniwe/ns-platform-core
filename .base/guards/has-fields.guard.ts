export function hasFields<T>(obj: any, keys: (keyof T)[]): obj is T {
  if (typeof obj !== 'object' || obj === null) return false;
  return keys.every((key) => key in obj);
}
