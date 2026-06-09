import type { DataSourceOptions, EntitySchema, MixedList } from 'typeorm';

export type PostgresRuntimeConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

type EntityClass = new (...args: any[]) => any;
type EntityTarget = string | EntityClass | EntitySchema;

export type TypeOrmBuildOptions = {
  entities?: MixedList<EntityTarget>;
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
  };
}
