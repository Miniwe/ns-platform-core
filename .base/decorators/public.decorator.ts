import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Позволяет пропустить проверку JWT для конкретных эндпоинтов (напр. /login)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
