import { buildApp } from '../src/app';
import { env } from '../src/config/env';
import { migrate } from '../src/db/migrate';

const app = buildApp();

let migratePromise: Promise<void> | null = null;

async function ensureMigrations() {
  if (!env.MIGRATE_ON_START) return;
  if (!migratePromise) {
    migratePromise = migrate().catch((err) => {
      migratePromise = null;
      throw err;
    });
  }
  await migratePromise;
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureMigrations();
  return app(req, res);
}
