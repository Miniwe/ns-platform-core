import type { Permission } from '@/security';

/**
 * Источник прав пользователя. Реализуется приложением (обычно сервисом
 * пользователей) и регистрируется под токеном `PERMISSION_SOURCE`.
 *
 * Если провайдер не зарегистрирован, guard откатывается на права из
 * `request.user.roles`, то есть на то, что принёс JWT.
 */
export interface PermissionSource {
  getUserPermissions(userId: number | string): Promise<Permission[]>;
}
