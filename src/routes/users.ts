import {
  createUser,
  deleteUser,
  deleteUserByUuid,
  getUserById,
  getUserByUuid,
  listUsers,
  updateUser,
  updateUserByUuid,
} from '@/repositories/users';
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const idOrUuidSchema = z.union([z.coerce.number().int().positive(), z.string().uuid()]);
const createSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});
const updateSchema = createSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});
const listSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

router.get('/', async (_req, res, next) => {
  try {
    const { page, pageSize } = listSchema.parse(_req.query);
    const result = await listUsers({ page, pageSize });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const idOrUuid = idOrUuidSchema.parse(req.params.id);
    const user =
      typeof idOrUuid === 'number' ? await getUserById(idOrUuid) : await getUserByUuid(idOrUuid);
    if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const idOrUuid = idOrUuidSchema.parse(req.params.id);
    const data = updateSchema.parse(req.body);
    // Build a payload with only defined fields
    const payload: Partial<{ name: string; email: string }> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;
    const user =
      typeof idOrUuid === 'number'
        ? await updateUser(idOrUuid, payload)
        : await updateUserByUuid(idOrUuid, payload);
    if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const idOrUuid = idOrUuidSchema.parse(req.params.id);
    const user =
      typeof idOrUuid === 'number' ? await deleteUser(idOrUuid) : await deleteUserByUuid(idOrUuid);
    if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export const usersRouter = router;
