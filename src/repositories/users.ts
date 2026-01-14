import { randomUUID } from 'crypto';
import type { Insertable } from 'kysely';
import { db } from '@/db/client';
import type { DB } from '@/db/types';

type User = DB['users'];
type UpdateUserInput = {
  name?: string;
  email?: string;
};
type Pagination = {
  page: number;
  pageSize: number;
};

export async function listUsers({ page, pageSize }: Pagination) {
  const offset = (page - 1) * pageSize;

  const [items, totalRow] = await Promise.all([
    db.selectFrom('users').selectAll().orderBy('id').limit(pageSize).offset(offset).execute(),
    db
      .selectFrom('users')
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst(),
  ]);

  const total = totalRow?.count ? Number(totalRow.count) : 0;
  const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize);

  return { items, page, pageSize, total, totalPages };
}

export async function getUserById(id: number) {
  return db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function getUserByUuid(uuid: string) {
  return db.selectFrom('users').selectAll().where('uuid', '=', uuid).executeTakeFirst();
}

export async function createUser(input: Pick<User, 'name' | 'email'>) {
  const now = new Date().toISOString();
  type NewUser = Pick<User, 'name' | 'email' | 'uuid'> & { created_at: string };
  const row: NewUser = { ...input, uuid: randomUUID(), created_at: now };
  return db
    .insertInto('users')
    .values(row as Insertable<User>)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const updates: Partial<Pick<User, 'name' | 'email'>> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.email !== undefined) updates.email = input.email;

  return db
    .updateTable('users')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}

export async function updateUserByUuid(uuid: string, input: UpdateUserInput) {
  const updates: Partial<Pick<User, 'name' | 'email'>> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.email !== undefined) updates.email = input.email;

  return db
    .updateTable('users')
    .set(updates)
    .where('uuid', '=', uuid)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteUser(id: number) {
  return db.deleteFrom('users').where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUserByUuid(uuid: string) {
  return db.deleteFrom('users').where('uuid', '=', uuid).returningAll().executeTakeFirst();
}
