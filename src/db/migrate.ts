import { randomUUID } from 'crypto';
import { db } from '@/db/client';

export async function migrate() {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('uuid', 'text', (col) => col.notNull().unique())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('created_at', 'text', (col) => col.notNull())
    .execute();

  // Si la tabla existe sin uuid (versiones previas), intenta agregarla y poblarla.
  try {
    await db.schema.alterTable('users').addColumn('uuid', 'text').execute();
  } catch {
    // ignore si ya existe
  }

  await db.updateTable('users').set({ uuid: randomUUID() }).where('uuid', 'is', null).execute();

  await db.schema
    .createIndex('users_uuid_idx')
    .ifNotExists()
    .on('users')
    .column('uuid')
    .unique()
    .execute();
}
