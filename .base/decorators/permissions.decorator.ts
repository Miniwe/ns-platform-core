import { z } from 'zod';
import { SetMetadata } from '@nestjs/common';
import { PermissionSchema } from '@/shared/schemas';

/**
 * Ключ метаданных для доступа в Guard.
 * Вынесен в константу для соблюдения принципа DRY.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Извлекаем тип требования к разрешению напрямую из Zod-схемы.
 * Это гарантирует, что если мы добавим новый ресурс или действие в схему,
 * TypeScript подсветит ошибки в декораторах по всему проекту.
 */
type PermissionRequirement = z.infer<typeof PermissionSchema>;

/**
 * Декоратор @Permissions
 * Позволяет задавать список необходимых прав для доступа к эндпоинту.
 * * Пример использования:
 * @Permissions({ resource: 'MATCHES', action: 'CREATE' })
 */
export const Permissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
