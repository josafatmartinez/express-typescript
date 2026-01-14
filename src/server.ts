import { buildApp } from '@/app';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const app = buildApp();

app.listen(env.PORT, () => {
  logger.info(`API up on http://localhost:${env.PORT}`);
});
