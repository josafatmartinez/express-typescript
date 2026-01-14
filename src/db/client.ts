import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { DB } from '@/db/types';

const dataDir = path.resolve(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });

const databaseFile = path.join(dataDir, 'app.db');
const sqlite = new Database(databaseFile);

// reduce locking issues when inspected externally
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('busy_timeout = 5000');

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({ database: sqlite }),
});
