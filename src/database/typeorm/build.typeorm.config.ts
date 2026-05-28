import type { DataSourceOptions } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export type PostgresRuntimeConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type TypeOrmBuildOptions = {
  entities?: string[];
  migrations?: string[];
  logging?: boolean;
  synchronize?: boolean;
  migrationsRun?: boolean;
  autoLoadEntities?: boolean;
};

export function buildPostgresTypeOrmConfig(
  db: PostgresRuntimeConfig,
  options: TypeOrmBuildOptions = {},
): DataSourceOptions {
  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    entities: options.entities ?? [],
    migrations: options.migrations ?? [],
    synchronize: options.synchronize ?? false,
    migrationsRun: options.migrationsRun ?? false,
    logging: options.logging ?? false,
  } satisfies PostgresConnectionOptions;
}