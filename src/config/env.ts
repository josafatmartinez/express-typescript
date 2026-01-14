import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.string().default('info'),
  CORS_ORIGIN: z.string().default('*'),
  POSTGRES_URL: z.url().optional(),
});

export const env = EnvSchema.parse(process.env);

export function parseCorsOrigin(origin: string): true | string[] {
  if (origin === '*') return true;

  return origin
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}
