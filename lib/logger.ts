// ========================================
// LOGGER OPTIMIZADO PARA PRODUCCIÓN
// ✅ Solo breadcrumbs para info/debug
// ✅ Solo captureException para errores
// ✅ Contexto estructurado siempre
// ✅ Integrado con Axiom mediante HTTP directo
// ========================================

// import * as Sentry from "@sentry/nextjs";
import { env } from './config/environment';

// Configuración de Axiom
// const AXIOM_TOKEN = process.env.AXIOM_TOKEN;
// const AXIOM_DATASET = process.env.AXIOM_DATASET || 'nextjs-app-logs';
// const AXIOM_ENDPOINT = 'https://eu-central-1.aws.edge.axiom.co/v1/ingest';

// ========================================
// TIPOS Y CATEGORÍAS
// ========================================
export type LogCategory =
  | "API"
  | "DB"
  | "PRISMA"
  | "STRIPE"
  | "AUTH"
  | "PDF"
  | "EMAIL"
  | "QUEUE"
  | "EMAIL_QUEUE"
  | "BUSINESS"
  | "WEBHOOK"
  | "SYSTEM";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
  category?: LogCategory;
  level?: LogLevel;
  requestId?: string;
  userId?: string;
  memberId?: string;
  eventId?: string;
  registrationId?: string;
  paymentId?: string;
  orderId?: string;
  duration?: number;
  statusCode?: number;
  method?: string;
  path?: string;
  [key: string]: any;
}

// ========================================
// HELPERS INTERNOS
// ========================================

/**
 * Envía logs a Axiom usando HTTP directo (sin batching)
 */
// const sendToAxiom = async (level: LogLevel, message: string, context?: LogContext) => {
//    // 🔥 1) No enviar nada en desarrollo
//   if (env.isDevelopment) return;

//   // 🔥 2) Ignorar categorías que no queremos en producción
//   const AXIOM_IGNORE_CATEGORIES = ["PRISMA"];
//   if (context?.category && AXIOM_IGNORE_CATEGORIES.includes(context.category)) {
//     return;
//   }

//   // 🔥 3) Verificar configuración
//   if (!AXIOM_TOKEN || !AXIOM_DATASET) return;

//   try {
//     const event = {
//       _time: new Date().toISOString(),
//       level,
//       message,
//       environment: env.nodeEnv,
//       ...context,
//     };

//     // Enviar mediante fetch (no bloqueante)
//     fetch(`${AXIOM_ENDPOINT}/${AXIOM_DATASET}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${AXIOM_TOKEN}`,
//         'Content-Type': 'application/x-ndjson',
//       },
//       body: JSON.stringify(event) + '\n',
//     }).catch((err) => {
//       // Solo log en desarrollo para no llenar la consola en producción
//       if (env.isDevelopment) {
//         console.error('Failed to send log to Axiom:', err.message);
//       }
//     });
//   } catch (error) {
//     // Silenciar errores de Axiom para no romper la app
//   }
// };

const formatMessage = (
  category: LogCategory | undefined,
  message: string
): string => {
  return category ? `[${category}] ${message}` : message;
};

const extractTags = (context?: LogContext): Record<string, string> => {
  if (!context) return {};

  const tags: Record<string, string> = {};
  if (context.userId) tags.userId = context.userId;
  if (context.memberId) tags.memberId = context.memberId;
  if (context.method) tags.method = context.method;
  if (context.path) tags.path = context.path;
  if (context.statusCode) tags.statusCode = String(context.statusCode);

  return tags;
};

// ========================================
// CORE LOGGER FUNCTIONS
// ========================================

export const debug = (message: string, context?: LogContext) => {
  const fullMessage = formatMessage(context?.category, message);

  if (env.isDevelopment) {
    console.debug("🐛", fullMessage, context || "");
  }

  // // 🔥 Solo enviar a Sentry en producción
  // if (!env.isDevelopment) {
  //   Sentry.addBreadcrumb({
  //     category: context?.category?.toLowerCase() || "debug",
  //     level: "debug",
  //     message: fullMessage,
  //     data: context,
  //     timestamp: Date.now() / 1000,
  //   });
  // }

  // sendToAxiom("debug", fullMessage, context);
};

export const info = (message: string, context?: LogContext) => {
  const fullMessage = formatMessage(context?.category, message);

  if (env.isDevelopment) {
    console.info("ℹ️", fullMessage, context || "");
  }

  // // 🔥 Solo enviar a Sentry en producción
  // if (!env.isDevelopment) {
  //   Sentry.addBreadcrumb({
  //     category: context?.category?.toLowerCase() || "info",
  //     level: "info",
  //     message: fullMessage,
  //     data: context,
  //     timestamp: Date.now() / 1000,
  //   });
  // }

  // sendToAxiom("info", fullMessage, context);
};

export const warn = (message: string, context?: LogContext) => {
  const fullMessage = formatMessage(context?.category, message);

  console.warn("⚠️", fullMessage, context || "");

  // // 🔥 Solo enviar a Sentry en producción
  // if (!env.isDevelopment) {
  //   Sentry.addBreadcrumb({
  //     category: context?.category?.toLowerCase() || "warning",
  //     level: "warning",
  //     message: fullMessage,
  //     data: context,
  //     timestamp: Date.now() / 1000,
  //   });

  //   Sentry.captureMessage(fullMessage, {
  //     level: "warning",
  //     tags: {
  //       category: context?.category || "unknown",
  //       ...extractTags(context),
  //     },
  //     extra: context,
  //   });
  // }

  // sendToAxiom("warn", fullMessage, context);
};

export const error = (
  message: string,
  errorOrContext?: Error | LogContext,
  context?: LogContext
) => {
  let err: Error;
  let ctx: LogContext | undefined;

  if (errorOrContext instanceof Error) {
    err = errorOrContext;
    ctx = context;
  } else {
    err = new Error(message);
    ctx = errorOrContext;
  }

  const fullMessage = formatMessage(ctx?.category, message);

  console.error("❌", fullMessage, err, ctx || "");

  if (ctx) {
    Object.entries(ctx).forEach(([key, value]) => {
      (err as any)[key] = value;
    });
  }

  // // 🔥 Solo enviar a Sentry en producción
  // if (!env.isDevelopment) {
  //   Sentry.captureException(err, {
  //     level: "error",
  //     tags: {
  //       category: ctx?.category || "unknown",
  //       ...extractTags(ctx),
  //     },
  //     extra: {
  //       message: fullMessage,
  //       ...ctx,
  //     },
  //   });
  // }

  // sendToAxiom("error", fullMessage, {
  //   ...ctx,
  //   errorName: err.name,
  //   errorMessage: err.message,
  //   errorStack: err.stack,
  // });
};

export const fatal = (
  message: string,
  errorOrContext?: Error | LogContext,
  context?: LogContext
) => {
  let err: Error;
  let ctx: LogContext | undefined;

  if (errorOrContext instanceof Error) {
    err = errorOrContext;
    ctx = context;
  } else {
    err = new Error(message);
    ctx = errorOrContext;
  }

  const fullMessage = formatMessage(ctx?.category, message);

  console.error("💥", fullMessage, err, ctx || "");

  if (ctx) {
    Object.entries(ctx).forEach(([key, value]) => {
      (err as any)[key] = value;
    });
  }

  // // 🔥 Solo enviar a Sentry en producción
  // if (!env.isDevelopment) {
  //   Sentry.captureException(err, {
  //     level: "fatal",
  //     tags: {
  //       category: ctx?.category || "unknown",
  //       ...extractTags(ctx),
  //     },
  //     extra: {
  //       message: fullMessage,
  //       ...ctx,
  //     },
  //   });
  // }

  // sendToAxiom("fatal", fullMessage, {
  //   ...ctx,
  //   errorName: err.name,
  //   errorMessage: err.message,
  //   errorStack: err.stack,
  // });
};

// ========================================
// MÉTODOS ESPECÍFICOS POR DOMINIO
// ========================================

export const api = {
  start: (method: string, path: string, context?: Omit<LogContext, "category">) => {
    info(`${method} ${path} - Started`, {
      ...context,
      category: "API",
      method,
      path,
    });
  },

  success: (
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: Omit<LogContext, "category">
  ) => {
    info(`${method} ${path} - ${statusCode} (${duration}ms)`, {
      ...context,
      category: "API",
      method,
      path,
      statusCode,
      duration,
    });
  },

  error: (
    method: string,
    path: string,
    statusCode: number,
    err: Error,
    context?: Omit<LogContext, "category">
  ) => {
    error(`${method} ${path} - ${statusCode}`, err, {
      ...context,
      category: "API",
      method,
      path,
      statusCode,
    });
  },
};

export const db = {
  query: (operation: string, table: string, context?: Omit<LogContext, "category">) => {
    debug(`${operation} ${table}`, {
      ...context,
      category: "DB",
      operation,
      table,
    });
  },

  success: (
    operation: string,
    table: string,
    duration: number,
    context?: Omit<LogContext, "category">
  ) => {
    debug(`${operation} ${table} - ${duration}ms`, {
      ...context,
      category: "DB",
      operation,
      table,
      duration,
    });
  },

  error: (
    operation: string,
    table: string,
    err: Error,
    context?: Omit<LogContext, "category">
  ) => {
    error(`${operation} ${table} failed`, err, {
      ...context,
      category: "DB",
      operation,
      table,
    });
  },
};

export const stripe = {
  event: (eventType: string, context?: Omit<LogContext, "category">) => {
    info(`Webhook received: ${eventType}`, {
      ...context,
      category: "STRIPE",
      eventType,
    });
  },

  success: (operation: string, context?: Omit<LogContext, "category">) => {
    info(`${operation} completed`, {
      ...context,
      category: "STRIPE",
      operation,
    });
  },

  error: (operation: string, err: Error, context?: Omit<LogContext, "category">) => {
    error(`${operation} failed`, err, {
      ...context,
      category: "STRIPE",
      operation,
    });
  },
};

export const email = {
  send: (emailType: string, recipient: string, context?: Omit<LogContext, "category">) => {
    info(`Sending ${emailType} to ${recipient}`, {
      ...context,
      category: "EMAIL",
      emailType,
      recipient,
    });
  },

  success: (emailType: string, recipient: string, context?: Omit<LogContext, "category">) => {
    info(`${emailType} sent to ${recipient}`, {
      ...context,
      category: "EMAIL",
      emailType,
      recipient,
    });
  },

  error: (
    emailType: string,
    recipient: string,
    err: Error,
    context?: Omit<LogContext, "category">
  ) => {
    warn(`Failed to send ${emailType} to ${recipient}: ${err.message}`, {
      ...context,
      category: "EMAIL",
      emailType,
      recipient,
      errorMessage: err.message,
    });
  },
};

export const auth = {
  login: (userId: string, method: string, context?: Omit<LogContext, "category">) => {
    info(`User logged in via ${method}`, {
      ...context,
      category: "AUTH",
      userId,
      method,
    });
  },

  logout: (userId: string, context?: Omit<LogContext, "category">) => {
    info(`User logged out`, {
      ...context,
      category: "AUTH",
      userId,
    });
  },

  unauthorized: (path: string, context?: Omit<LogContext, "category">) => {
    warn(`Unauthorized access attempt to ${path}`, {
      ...context,
      category: "AUTH",
      path,
    });
  },
};

export const business = {
  membershipActivated: (memberId: string, context?: Omit<LogContext, "category">) => {
    info(`Membership activated`, {
      ...context,
      category: "BUSINESS",
      memberId,
      event: "membership_activated",
    });
  },

  eventRegistration: (eventId: string, context?: Omit<LogContext, "category">) => {
    info(`Event registration created`, {
      ...context,
      category: "BUSINESS",
      eventId,
      event: "event_registration",
    });
  },

  paymentCompleted: (paymentId: string, amount: number, context?: Omit<LogContext, "category">) => {
    info(`Payment completed: ${amount / 100}€`, {
      ...context,
      category: "BUSINESS",
      paymentId,
      amount,
      event: "payment_completed",
    });
  },
};

export const prisma = {
  query: (query: any, context?: Omit<LogContext, "category">) => {
    debug(`Query: ${query.query || 'unknown'}`, {
      ...context,
      category: "PRISMA",
      duration: query.duration,
      target: query.target,
    });
  },

  warn: (event: any, context?: Omit<LogContext, "category">) => {
    const isNeonConnectionClosed =
      event?.kind === 'Closed' ||
      event?.message?.includes('kind: Closed') ||
      event?.message?.includes('PostgreSQL connection: Error { kind: Closed');

    if (isNeonConnectionClosed) {
      debug('Neon connection closed (expected in free tier)', {
        ...context,
        category: "PRISMA",
        target: event?.target,
        neonAutoSuspend: true,
      });
    } else {
      warn(event.message || 'Prisma warning', {
        ...context,
        category: "PRISMA",
        target: event?.target,
        ...event,
      });
    }
  },

  error: (event: any, context?: Omit<LogContext, "category">) => {
    const isNeonConnectionClosed =
      event?.kind === 'Closed' ||
      event?.message?.includes('kind: Closed') ||
      event?.message?.includes('PostgreSQL connection: Error { kind: Closed');

    if (isNeonConnectionClosed) {
      warn('Neon connection closed during query', {
        ...context,
        category: "PRISMA",
        target: event?.target,
        neonAutoSuspend: true,
      });
    } else {
      const err = event instanceof Error 
        ? event 
        : new Error(event.message || 'Prisma error');
      
      error('Prisma error', err, {
        ...context,
        category: "PRISMA",
        target: event?.target,
        ...event,
      });
    }
  },
};

export const logger = {
  debug,
  info,
  warn,
  error,
  fatal,
  api,
  db,
  prisma,
  stripe,
  email,
  auth,
  business,
};

export default logger;