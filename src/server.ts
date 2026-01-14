import { buildApp } from '@/app';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { migrate } from '@/db/migrate';

const app = buildApp();

async function start() {
  try {
    await migrate();
    app.listen(env.PORT, () => {
      logger.info(`API up on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

void start();
