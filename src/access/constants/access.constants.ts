import type { Permission } from '@/security';

/** Токен провайдера, отдающего права пользователя из хранилища. */
export const PERMISSION_SOURCE = Symbol('PERMISSION_SOURCE');

/** Токен настроек модуля доступа. */
export const ACCESS_OPTIONS = Symbol('ACCESS_OPTIONS');

/**
 * Роль обслуживания, проходящая проверки без ограничений.
 * Решение D-002: обход нужен, чтобы не потерять вход в систему при пустых
 * или рассинхронизированных правах; `ADMIN` под обход не попадает — его
 * доступ определяется выданными правами.
 */
export const DEFAULT_SUPER_ROLES = ['DEVELOPER'] as const;

/** Время жизни кеша прав пользователя, миллисекунды. */
export const DEFAULT_PERMISSION_CACHE_TTL_MS = 5 * 60 * 1000;

/** Префикс ключа кеша прав пользователя. */
export const permissionCacheKey = (userId: number | string): string => `user:${userId}:permissions`;

export type AccessOptions = {
  /** Имена ролей, проходящих любую проверку прав. По умолчанию — `DEVELOPER`. */
  superRoles?: string[];
  /** Время жизни кеша прав, миллисекунды. */
  permissionCacheTtlMs?: number;
};

export type PermissionCarrier = {
  id: number | string;
  roles?: { name: string; permissions?: Permission[] }[];
};
