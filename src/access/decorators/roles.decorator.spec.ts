import 'reflect-metadata';
import { ROLES_KEY } from '@/security';
import { RequireRoles } from './roles.decorator';

describe('RequireRoles', () => {
  class TestController {
    @RequireRoles('ADMIN', 'MODERATOR')
    static secured() {}
  }

  it('должен выставлять metadata с ролями', () => {
    const roles = Reflect.getMetadata(ROLES_KEY, TestController.secured);
    expect(roles).toEqual(['ADMIN', 'MODERATOR']);
  });

  it('должен бросать ошибку при пустом наборе ролей', () => {
    expect(() => RequireRoles()).toThrow();
  });

  it('должен бросать ошибку при пустом имени роли', () => {
    expect(() => RequireRoles('')).toThrow();
  });
});