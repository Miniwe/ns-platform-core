import type { RequestUser } from '../schemas';

export type HttpRequestLike<TUser = RequestUser> = {
  user?: TUser;
  headers?: Record<string, unknown>;
  ip?: string;
  method?: string;
  url?: string;
  query?: unknown;
  params?: unknown;
  body?: unknown;
  connection?: {
    remoteAddress: string;
  };
  route?: {
    path: string
  };
};

export type PlatformRequest<TUser = RequestUser> = HttpRequestLike<TUser>;

export type AuthenticatedRequest<TUser = RequestUser> = HttpRequestLike<TUser> & {
  user: TUser;
};
