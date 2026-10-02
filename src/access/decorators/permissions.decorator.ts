import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';
import { ANY_PERMISSIONS_KEY, PERMISSIONS_KEY, PermissionSchema } from '@/security';

export const PermissionRequirementSchema = z.array(PermissionSchema).min(1);
export type PermissionRequirement = z.infer<typeof PermissionRequirementSchema>;

/**
 * Требуются ВСЕ перечисленные права (решение D-005).
 * Права нормализуются схемой — регистр записи значения не имеет.
 */
export function RequirePermissions(...permissions: PermissionRequirement) {
  const validated = PermissionRequirementSchema.parse(permissions);
  return SetMetadata(PERMISSIONS_KEY, validated);
}

/**
 * Достаточно ЛЮБОГО из перечисленных прав (решение D-005).
 *
 * Отдельное имя вместо параметра: правило доступа должно читаться в коде
 * контроллера, а не выводиться из того, какая реализация guard-а подключена.
 */
export function RequireAnyPermission(...permissions: PermissionRequirement) {
  const validated = PermissionRequirementSchema.parse(permissions);
  return SetMetadata(ANY_PERMISSIONS_KEY, validated);
}
