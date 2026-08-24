import { PrismaClient } from '@prisma/client';

let client: PrismaClient;

try {
  client = new PrismaClient({
    log: ['error'],
  });
} catch (err) {
  console.warn('[Prisma] Safe fallback proxy engaged:', err);
  client = new Proxy({} as PrismaClient, {
    get() {
      return () => Promise.reject(new Error('Prisma database unavailable in serverless environment'));
    },
  });
}

export const prisma = client;
