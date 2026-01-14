import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@/utils/logger';

type NormalizedError = {
  status: number;
  error: string;
  message: string;
};

function normalizeError(err: unknown): NormalizedError {
  if (err instanceof ZodError) {
    const message =
      err.issues
        .map(({ path, message: issueMessage }) => {
          const location = path.join('.') || 'value';
          return `${location}: ${issueMessage}`;
        })
        .join('; ') || 'Invalid request';

    return {
      status: 400,
      error: 'ValidationError',
      message,
    };
  }

  if (typeof err === 'object' && err !== null && 'message' in err) {
    const { status, message, code, name } = err as {
      status?: number;
      message?: string;
      code?: string;
      name?: string;
    };

    return {
      status: status && Number.isInteger(status) ? (status as number) : 500,
      error: code || name || 'Error',
      message: message || 'Unexpected error',
    };
  }

  return {
    status: 500,
    error: 'InternalServerError',
    message: 'Something went wrong',
  };
}

// keep 4-arg signature for Express error middleware, even if next is unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const normalizedError = normalizeError(err);

  // registra el error original pero responde con un shape consistente
  logger.error({ err }, 'Unhandled error');

  res.status(normalizedError.status).json({
    error: normalizedError.error,
    message: normalizedError.message,
  });
}
