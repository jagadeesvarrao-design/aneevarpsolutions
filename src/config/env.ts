import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.string().default('production'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  CORS_ORIGIN: z.string().default('*'),
  ADMIN_API_KEY: z.string().default('aneevarp_admin_secret_key_change_in_production'),
});

const rawValues = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'aneevarp_admin_secret_key_change_in_production',
};

const parsedEnv = envSchema.safeParse(rawValues);

export const env = parsedEnv.success ? parsedEnv.data : rawValues;
