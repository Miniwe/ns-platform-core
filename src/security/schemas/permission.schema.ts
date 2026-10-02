import { z } from 'zod';

/**
 * Имя ресурса и действия нормализуется к нижнему регистру с обрезкой пробелов.
 *
 * Сравнение прав посимвольное, поэтому `ROLES` и `roles` без нормализации —
 * два разных права, и расхождение регистра проявляется не ошибкой, а тихим
 * отказом в доступе. Нормализация выполняется в схеме, то есть в одном месте
 * для декоратора, guard-а и записи прав роли.
 */
export const PermissionResourceSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .describe('Permission resource identifier (lower-case)');

/**
 * Действие — свободная строка, а не фиксированный набор CRUD-глаголов:
 * операции вроде `attach-user` или `update-permissions` в CRUD не укладываются.
 */
export const PermissionActionSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .describe('Permission action identifier (lower-case)');

export const PermissionSchema = z
  .object({
    resource: PermissionResourceSchema,
    action: PermissionActionSchema,
  })
  .describe('Permission descriptor');

export type Permission = z.infer<typeof PermissionSchema>;

/** Разделитель в строковом представлении права: `resource:action`. */
export const PERMISSION_SEPARATOR = ':';

/**
 * Строковое представление права — `resource:action`.
 * Используется как ключ сравнения и как компактная форма записи.
 */
export const PermissionStringSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine(
    (value) => {
      const parts = value.split(PERMISSION_SEPARATOR);
      return parts.length === 2 && parts.every((part) => part.length > 0);
    },
    { message: `Permission must look like "resource${PERMISSION_SEPARATOR}action"` },
  )
  .describe('Permission in "resource:action" form');

/** Приводит право к строковому ключу сравнения. */
export const permissionToString = (permission: Permission): string =>
  `${permission.resource}${PERMISSION_SEPARATOR}${permission.action}`;

/** Разбирает строку `resource:action` в нормализованное право. */
export const permissionFromString = (value: string): Permission => {
  const [resource, action] = PermissionStringSchema.parse(value).split(PERMISSION_SEPARATOR);

  return PermissionSchema.parse({ resource, action });
};

/** Сравнивает два права после нормализации. */
export const isSamePermission = (left: Permission, right: Permission): boolean =>
  permissionToString(left) === permissionToString(right);

/** Убирает дубли, сохраняя порядок первого вхождения. */
export const uniquePermissions = (permissions: Permission[]): Permission[] => {
  const seen = new Set<string>();

  return permissions.filter((permission) => {
    const key = permissionToString(permission);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};
