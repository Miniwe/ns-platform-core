import { buildPostgresTypeOrmConfig } from './build.typeorm.config';

describe('buildPostgresTypeOrmConfig', () => {
  const db = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'secret',
    database: 'app_db',
  };

  it('строит postgres config с дефолтными значениями', () => {
    const result = buildPostgresTypeOrmConfig(db);

    expect(result).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'app_db',
      entities: [],
      migrations: [],
      synchronize: false,
      migrationsRun: false,
      logging: false,
    });
  });

  it('применяет переданные overrides', () => {
    const result = buildPostgresTypeOrmConfig(db, {
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: true,
      migrationsRun: true,
      logging: true,
    });

    expect(result).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'app_db',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: true,
      migrationsRun: true,
      logging: true,
    });
  });

  it('оставляет необязательные массивы пустыми если они не переданы', () => {
    const result = buildPostgresTypeOrmConfig(db, {
      logging: true,
    });

    expect(result.entities).toEqual([]);
    expect(result.migrations).toEqual([]);
    expect(result.logging).toBe(true);
  });
});
