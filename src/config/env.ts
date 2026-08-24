import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'aneevarp_admin_secret_key_change_in_production',
};
