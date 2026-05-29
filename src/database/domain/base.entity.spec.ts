import { BaseEntity, BaseEntityNoUpdate } from './base.entity';

describe('BaseEntity domain classes', () => {
  it('BaseEntityNoUpdate can hold base fields', () => {
    class TestEntity extends BaseEntityNoUpdate {}

    const entity = new TestEntity();
    entity.id = 1;
    entity.uuid = '550e8400-e29b-41d4-a716-446655440000';
    entity.createdAt = '2026-05-29T12:00:00.000Z';

    expect(entity.id).toBe(1);
    expect(entity.uuid).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('BaseEntity extends BaseEntityNoUpdate with updatedAt', () => {
    class TestEntity extends BaseEntity {}

    const entity = new TestEntity();
    entity.updatedAt = '2026-05-29T13:00:00.000Z';

    expect(entity.updatedAt).toBe('2026-05-29T13:00:00.000Z');
  });
});