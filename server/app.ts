import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { env } from '@server/config/env.js';
import {
  attachUserSession,
  errorMiddleware,
  httpLogger,
} from '@server/lib/index.js';
import apiRouter from '@server/routes/api.js';

/**
 * Parse comma-separated CORS origin list from environment config.
 */
function parseCorsOrigins(): string[] {
  return env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** Identify mutating API methods for write throttling. */
function isWriteMethod(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
}

/** Platform probes (Render health checks poll these every few seconds). */
const RATE_LIMIT_EXEMPT_PATHS = new Set(['/api/health', '/api/ready']);

/**
 * True for health/readiness probes so they bypass the `/api` read limiter.
 * Uses `baseUrl + path` because, when mounted via `app.use('/api', …)`,
 * `req.path` is `/health` rather than `/api/health`.
 */
function isRateLimitExemptPath(req: express.Request): boolean {
  const fullPath = `${req.baseUrl}${req.path}`
    .replace(/\/+$/, '')
    .toLowerCase();
  return RATE_LIMIT_EXEMPT_PATHS.has(fullPath);
}

/** Build stable rate-limit identity from auth/session/device/ip context. */
function resolveRateLimitKey(req: express.Request): string {
  if (req.authUserId) return `user:${req.authUserId}`;
  const sessionHeader = req.get('x-session-id');
  if (sessionHeader) return `session:${sessionHeader}`;
  const deviceId = req.get('x-device-id');
  if (deviceId) return `device:${deviceId}`;
  return `ip:${ipKeyGenerator(req.ip || '')}`;
}

/**
 * Construct and configure the Express application instance.
 * Keep server startup concerns in `server.ts`.
 */
export function createApp(): express.Express {
  const app = express();
  // Trust one proxy hop in production (e.g. Render) so req.protocol reflects
  // X-Forwarded-Proto. In local dev, trusting proxy can mis-read scheme if a
  // client sends spoofed forwarded headers and break OIDC callback handling.
  if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }
  const allowedOrigins = parseCorsOrigins();
  const apiReadRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isWriteMethod(req.method) || isRateLimitExemptPath(req),
    keyGenerator: resolveRateLimitKey,
  });
  const apiWriteRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_WRITE_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => !isWriteMethod(req.method),
    keyGenerator: resolveRateLimitKey,
  });
  const adminWriteRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: Math.max(10, Math.floor(env.RATE_LIMIT_WRITE_MAX / 2)),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: resolveRateLimitKey,
    skip: (req) => !isWriteMethod(req.method),
  });

  // Create paths for static directories.
  const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
  const uploadsStaticDir = new URL('public', import.meta.url).pathname;

  app.use(helmet());
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(express.static(reactStaticDir));
  // Static directory for file uploads server/public/.
  app.use(express.static(uploadsStaticDir));
  app.use(httpLogger);
  app.use(express.json());
  app.use(attachUserSession);
  app.use('/api', apiReadRateLimiter);
  app.use('/api', apiWriteRateLimiter);
  app.use('/api/admin', adminWriteRateLimiter);

  app.use('/api', apiRouter);

  /*
   * Handles paths that aren't handled by any other route handler.
   * It responds with `index.html` to support page refreshes with React Router.
   * This must be the _last_ route, just before errorMiddleware.
   */
  app.get('/{*path}', (_req, res) =>
    res.sendFile(`${reactStaticDir}/index.html`),
  );

  app.use(errorMiddleware);

  return app;
}
