import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely';
import { Pool } from 'pg';
import { env } from '@/config/env';
import type { DB } from '@/db/types';

function createSqliteDb() {
  const dataDir = path.resolve(process.cwd(), 'data');
  fs.mkdirSync(dataDir, { recursive: true });

  const databaseFile = path.join(dataDir, 'app.db');
  const sqlite = new Database(databaseFile);

  // reduce locking issues when inspected externally
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('busy_timeout = 5000');

  return new Kysely<DB>({
    dialect: new SqliteDialect({ database: sqlite }),
  });
}

function createPostgresDb() {
  const pool = new Pool({ connectionString: env.POSTGRES_URL });

  return new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
  });
}

// Prefer Postgres if a connection string is provided, fallback to SQLite file.
export const db = env.POSTGRES_URL ? createPostgresDb() : createSqliteDb();
