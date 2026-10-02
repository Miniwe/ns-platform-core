export const ROLES_KEY = Symbol('ROLES_KEY');

/** Метаданные `@RequirePermissions` — требуются ВСЕ перечисленные права. */
export const PERMISSIONS_KEY = Symbol('PERMISSIONS_KEY');

/** Метаданные `@RequireAnyPermission` — достаточно ЛЮБОГО из перечисленных прав. */
export const ANY_PERMISSIONS_KEY = Symbol('ANY_PERMISSIONS_KEY');

/** Тег кеша, под которым лежат разрешённые права пользователей. */
export const PERMISSION_CACHE_TAG = 'user-permissions';
