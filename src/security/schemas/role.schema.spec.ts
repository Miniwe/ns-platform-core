import { RoleSchema } from './role.schema';

describe('RoleSchema', () => {
  it('должен парсить валидную роль', () => {
    const result = RoleSchema.parse({
      name: 'ADMIN',
      description: 'Administrator',
      permissions: [{ resource: 'users', action: 'read' }],
    });

    expect(result).toEqual({
      name: 'ADMIN',
      description: 'Administrator',
      permissions: [{ resource: 'users', action: 'read' }],
    });
  });

  it('должен подставлять defaults', () => {
    const result = RoleSchema.parse({
      name: 'USER',
    });

    expect(result).toEqual({
      name: 'USER',
      description: '',
      permissions: [],
    });
  });

  it('должен падать при пустом name', () => {
    expect(() =>
      RoleSchema.parse({
        name: '',
      }),
    ).toThrow();
  });
});