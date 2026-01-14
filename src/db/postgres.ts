import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { env } from '@/config/env';
import type { DB } from '@/db/types';

export function createPostgresDb(connectionString = env.POSTGRES_URL) {
  if (!connectionString) {
    throw new Error('POSTGRES_URL is required to initialize Postgres client');
  }

  const pool = new Pool({ connectionString });

  return new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
  });
}
