import { Router } from 'express';
import { healthRouter } from '@/routes/health';
import { usersRouter } from '@/routes/users';
import { API_VERSION } from '@/config/api';

export const router = Router();

// versionado estilo /api/v1
router.use(`${API_VERSION}/health`, healthRouter);
router.use(`${API_VERSION}/users`, usersRouter);
