import 'reflect-metadata';
import { PERMISSIONS_KEY } from '@/security';
import { RequirePermissions } from './permissions.decorator';

describe('RequirePermissions', () => {
  class TestController {
    @RequirePermissions(
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
    )
    static secured() {}
  }

  it('должен выставлять metadata с permissions', () => {
    const permissions = Reflect.getMetadata(PERMISSIONS_KEY, TestController.secured);
    expect(permissions).toEqual([
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
    ]);
  });

  it('должен бросать ошибку при пустом наборе permissions', () => {
    expect(() => RequirePermissions()).toThrow();
  });

  it('должен бросать ошибку при невалидном permission', () => {
    expect(() =>
      RequirePermissions({ resource: '', action: 'read' } as any),
    ).toThrow();
  });
});