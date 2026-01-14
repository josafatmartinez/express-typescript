import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { env, parseCorsOrigin } from '@/config/env';
import { API_PREFIX } from '@/config/api';
import { openApiSpec } from '@/config/openapi';
import { logger } from '@/utils/logger';
import { router } from '@/routes';
import { notFound } from '@/middlewares/not-found';
import { errorHandler } from '@/middlewares/error-handler';

export function buildApp() {
  const app = express();

  // logs http
  app.use(pinoHttp({ logger }));

  // seguridad y performance
  app.use(helmet());
  app.use(compression());

  // cors
  app.use(
    cors({
      origin: parseCorsOrigin(env.CORS_ORIGIN),
      credentials: true,
    }),
  );

  // body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // rutas
  app.use(`${API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.use(API_PREFIX, router);

  // 404 + error handler al final
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
