// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import { env } from './config/environment';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
    errorFormat: 'minimal',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// ✅ Cachear en TODOS los ambientes para reutilizar conexiones en serverless
// En Vercel, los warm starts reutilizan el proceso → reutilizan el PrismaClient
globalForPrisma.prisma = prisma;

// ✅ Event handlers con el logger actualizado
prisma.$on('error' as never, (e: any) => {
  logger.prisma.error(e);
});

prisma.$on('warn' as never, (e: any) => {
  logger.prisma.warn(e);
});

// ❌ Query logs deshabilitados para reducir ruido en consola
// Si necesitas debug de queries, descomenta esto temporalmente:
// if (env.isDevelopment) {
//   prisma.$on('query' as never, (e: any) => {
//     logger.prisma.query(e);
//   });
// }

// ========================================
// RETRY HELPER PARA NEON
// ========================================
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 150
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = i === maxRetries - 1;

      // Detectar errores de conexión de Neon
      const isNeonConnectionError =
        error?.code === 'P2024' || // Timed out fetching connection
        error?.code === 'P1001' || // Can't reach database
        error?.message?.includes('kind: Closed') ||
        error?.message?.includes('PostgreSQL connection: Error');

      if (isNeonConnectionError && !isLastAttempt) {
        const delay = delayMs * (i + 1);

        logger.prisma.warn({
          message: `Neon connection retry ${i + 1}/${maxRetries}`,
          delay_ms: delay,
          error_code: error.code,
          error_message: error.message,
        });

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}