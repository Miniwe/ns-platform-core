import 'reflect-metadata';
import { ANY_PERMISSIONS_KEY, PERMISSIONS_KEY } from '@/security';
import { RequireAnyPermission, RequirePermissions } from './permissions.decorator';

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
describe('RequireAnyPermission', () => {
  class TestController {
    @RequireAnyPermission({ resource: 'USERS', action: 'EXPORT' })
    static secured() {}
  }

  it('должен выставлять metadata под отдельным ключом', () => {
    expect(Reflect.getMetadata(ANY_PERMISSIONS_KEY, TestController.secured)).toEqual([
      { resource: 'users', action: 'export' },
    ]);
  });

  it('не должен трогать ключ RequirePermissions', () => {
    expect(Reflect.getMetadata(PERMISSIONS_KEY, TestController.secured)).toBeUndefined();
  });

  it('должен бросать ошибку при пустом наборе', () => {
    expect(() => RequireAnyPermission()).toThrow();
  });
});

describe('Нормализация в RequirePermissions', () => {
  class CaseController {
    @RequirePermissions({ resource: ' ROLES ', action: 'Create' })
    static secured() {}
  }

  it('должен приводить права к нижнему регистру', () => {
    expect(Reflect.getMetadata(PERMISSIONS_KEY, CaseController.secured)).toEqual([
      { resource: 'roles', action: 'create' },
    ]);
  });
});
