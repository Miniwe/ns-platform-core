import { RequestUser } from '@/security';
import type { ModuleMetadata, Type } from '@nestjs/common';
import type { SignOptions } from 'jsonwebtoken';

export interface AuthUserLike {
  id: number;
  uuid: string;
  email: string;
  username?: string;
  password?: string;
  refreshToken?: string;
  verificationToken?: string;
  isVerified?: boolean;
  roles?: Array<{ name: string }>;
}

export interface AuthUsersServicePort<TUser extends AuthUserLike = AuthUserLike> {
  findOne(options: unknown): Promise<TUser | null>;
  update(id: number, payload: Record<string, unknown>): Promise<unknown>;
  findForAuth?(uuid: string): Promise<TUser | null>;
}

export interface AuthModuleOptions<TUser extends AuthUserLike = AuthUserLike> {
  jwtSecret: string;
  accessExpiresIn?: SignOptions['expiresIn'];
  refreshExpiresIn?: SignOptions['expiresIn'];
  userEntity: Type<TUser>;
  usersServiceToken: string | symbol | Type<AuthUsersServicePort<TUser>>;
  mapUserToRequestUser?: (user: TUser) => RequestUser;
  global?: boolean;
}

export interface AuthModuleAsyncOptions<TUser extends AuthUserLike = AuthUserLike> extends Pick<
  ModuleMetadata,
  'imports'
> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<AuthModuleOptions<TUser>> | AuthModuleOptions<TUser>;
  global?: boolean;
}
