import pino, { stdTimeFunctions } from 'pino';
import { env } from '@/config/env';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: null, // quita pid/hostname si quieres logs más limpios
  timestamp: stdTimeFunctions.isoTime,
});
