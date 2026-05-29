import { BaseNoUpadteSchema, BaseSchema } from './base.schema';

describe('BaseNoUpadteSchema', () => {
  it('parses valid base entity payload', () => {
    const result = BaseNoUpadteSchema.parse({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2026-05-29T12:00:00.000Z',
    });

    expect(result.id).toBe(1);
  });

  it('allows missing createdAt', () => {
    const result = BaseNoUpadteSchema.parse({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result.createdAt).toBeUndefined();
  });

  it('fails on invalid uuid', () => {
    expect(() =>
      BaseNoUpadteSchema.parse({
        id: 1,
        uuid: 'bad-uuid',
      }),
    ).toThrow();
  });
});

describe('BaseSchema', () => {
  it('parses valid payload with updatedAt', () => {
    const result = BaseSchema.parse({
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2026-05-29T12:00:00.000Z',
      updatedAt: '2026-05-29T13:00:00.000Z',
    });

    expect(result.updatedAt).toBe('2026-05-29T13:00:00.000Z');
  });

  it('fails on invalid updatedAt', () => {
    expect(() =>
      BaseSchema.parse({
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        updatedAt: 'not-a-date',
      }),
    ).toThrow();
  });
});