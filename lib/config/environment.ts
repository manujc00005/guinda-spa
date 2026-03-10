/**
 * Configuración Centralizada de Entorno
 *
 * Módulo único para toda la detección de entorno en la aplicación.
 * Evita duplicación de lógica y asegura consistencia.
 */

/**
 * Tipos de entorno disponibles
 */
export type Environment = 'development' | 'production' | 'test';

/**
 * Tipo simplificado para feature flags y configs (dev/prod)
 */
export type EnvironmentShort = 'dev' | 'prod';

/**
 * Configuración de entorno singleton
 */
class EnvironmentConfig {
  /**
   * Entorno actual de Node.js
   */
  readonly nodeEnv: Environment;

  /**
   * Versión simplificada del entorno (dev/prod)
   * Útil para feature flags y configuraciones binarias
   */
  readonly env: EnvironmentShort;

  /**
   * ¿Estamos en desarrollo?
   */
  readonly isDevelopment: boolean;

  /**
   * ¿Estamos en producción?
   */
  readonly isProduction: boolean;

  /**
   * ¿Estamos en test?
   */
  readonly isTest: boolean;

  constructor() {
    // Normalizar NODE_ENV
    const rawEnv = process.env.NODE_ENV || 'development';

    this.nodeEnv = rawEnv as Environment;
    this.isDevelopment = rawEnv === 'development';
    this.isProduction = rawEnv === 'production';
    this.isTest = rawEnv === 'test';

    // Versión simplificada (dev/prod)
    // Test se considera 'dev' para feature flags
    this.env = this.isProduction ? 'prod' : 'dev';
  }

  /**
   * Obtener nombre del entorno para logs/debugging
   */
  getEnvironmentName(): string {
    return this.nodeEnv;
  }

  /**
   * Mostrar stack traces en errores (solo en dev)
   */
  shouldShowStack(): boolean {
    return this.isDevelopment;
  }

  /**
   * Habilitar logs detallados (solo en dev)
   */
  shouldLogVerbose(): boolean {
    return this.isDevelopment;
  }

  /**
   * Obtener entorno para analytics/logging
   */
  getAnalyticsEnvironment(): string {
    return this.nodeEnv;
  }
}

/**
 * Instancia singleton de configuración de entorno
 *
 * @example
 * ```ts
 * import { env } from '@/lib/config/environment';
 *
 * if (env.isDevelopment) {
 *   console.log('Running in development');
 * }
 *
 * const flags = await prisma.featureFlag.findMany({
 *   where: { env: env.env } // 'dev' o 'prod'
 * });
 * ```
 */
export const env = new EnvironmentConfig();

/**
 * Alias para compatibilidad
 */
export const isProduction = env.isProduction;
export const isDevelopment = env.isDevelopment;
export const isTest = env.isTest;

/**
 * Helper: Obtener configuración basada en entorno
 *
 * @example
 * ```ts
 * const apiUrl = getEnvConfig({
 *   development: 'http://localhost:3000',
 *   production: 'https://api.example.com',
 *   test: 'http://localhost:3001'
 * });
 * ```
 */
export function getEnvConfig<T>(config: {
  development: T;
  production: T;
  test?: T;
}): T {
  if (env.isTest && config.test !== undefined) {
    return config.test;
  }

  return env.isProduction ? config.production : config.development;
}

/**
 * Helper: Ejecutar función solo en desarrollo
 */
export function ifDevelopment<T>(fn: () => T): T | undefined {
  return env.isDevelopment ? fn() : undefined;
}

/**
 * Helper: Ejecutar función solo en producción
 */
export function ifProduction<T>(fn: () => T): T | undefined {
  return env.isProduction ? fn() : undefined;
}
