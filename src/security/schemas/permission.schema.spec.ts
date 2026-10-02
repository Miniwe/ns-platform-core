import {
  isSamePermission,
  permissionFromString,
  PermissionSchema,
  permissionToString,
  uniquePermissions,
} from './permission.schema';

describe('PermissionSchema', () => {
  it('должен парсить валидный permission', () => {
    const result = PermissionSchema.parse({
      resource: 'users',
      action: 'read',
    });

    expect(result).toEqual({
      resource: 'users',
      action: 'read',
    });
  });

  it('должен падать при пустом resource', () => {
    expect(() =>
      PermissionSchema.parse({
        resource: '',
        action: 'read',
      }),
    ).toThrow();
  });

  it('должен падать при пустом action', () => {
    expect(() =>
      PermissionSchema.parse({
        resource: 'users',
        action: '',
      }),
    ).toThrow();
  });
});
describe('Нормализация и ключи прав', () => {
  it('приводит ресурс и действие к нижнему регистру и обрезает пробелы', () => {
    expect(PermissionSchema.parse({ resource: '  ROLES ', action: 'Attach-User' })).toEqual({
      resource: 'roles',
      action: 'attach-user',
    });
  });

  it('падает, если после обрезки строка пустая', () => {
    expect(() => PermissionSchema.parse({ resource: '   ', action: 'read' })).toThrow();
  });

  it('permissionToString собирает ключ сравнения', () => {
    expect(permissionToString({ resource: 'roles', action: 'create' })).toBe('roles:create');
  });

  it('permissionFromString разбирает строку и нормализует её', () => {
    expect(permissionFromString(' Roles:Create ')).toEqual({
      resource: 'roles',
      action: 'create',
    });
  });

  it('permissionFromString падает на строке без разделителя', () => {
    expect(() => permissionFromString('roles')).toThrow();
    expect(() => permissionFromString('roles:')).toThrow();
    expect(() => permissionFromString('a:b:c')).toThrow();
  });

  it('isSamePermission сравнивает без учёта регистра', () => {
    expect(
      isSamePermission({ resource: 'roles', action: 'create' }, {
        resource: 'roles',
        action: 'create',
      }),
    ).toBe(true);
  });

  it('uniquePermissions убирает дубли, сохраняя порядок', () => {
    expect(
      uniquePermissions([
        { resource: 'b', action: 'x' },
        { resource: 'a', action: 'y' },
        { resource: 'b', action: 'x' },
      ]),
    ).toEqual([
      { resource: 'b', action: 'x' },
      { resource: 'a', action: 'y' },
    ]);
  });
});
