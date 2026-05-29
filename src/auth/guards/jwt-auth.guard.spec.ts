import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(reflector);
  });

  it('должен возвращать true для public route', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const ctx = {
      getHandler: () => 'handler',
      getClass: () => 'class',
    } as any;

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('handleRequest должен вернуть user, если он есть', () => {
    const user = { id: 1 };
    expect(guard.handleRequest(null, user)).toBe(user);
  });

  it('handleRequest должен бросать UnauthorizedException, если user отсутствует', () => {
    expect(() => guard.handleRequest(null, null)).toThrow(UnauthorizedException);
  });

  it('handleRequest должен пробрасывать исходную ошибку', () => {
    const err = new Error('jwt failed');

    expect(() => guard.handleRequest(err, null)).toThrow(err);
  });
});