import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  CORS_ORIGIN: z.string().default('*'),
  ADMIN_API_KEY: z.string().min(8).default('aneevarp_admin_secret_key_change_in_production'),
});

const parsedEnv = envSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
});

if (!parsedEnv.success) {
  console.error('❌ [Security/Config Error] Invalid Environment Variables Configuration:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Fatal: Application refused to boot with invalid production environment variables.');
  }
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : {
      PORT: process.env.PORT || '4000',
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
      CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
      ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'aneevarp_admin_secret_key_change_in_production',
    };
