import { PermissionSchema } from './permission.schema';

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