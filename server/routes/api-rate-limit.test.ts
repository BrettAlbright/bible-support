import request from 'supertest';
import { Express } from 'express';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { getDrizzleDb } from '@server/db/drizzle.js';

vi.mock('@server/db/drizzle.js', () => ({
  getDrizzleDb: vi.fn(),
}));

/**
 * Render health checks poll `/api/health` every few seconds, so health/ready
 * must bypass the `/api` read limiter while other `/api` routes stay limited.
 */
describe('api rate limiting', () => {
  let app: Express;
  const getDrizzleDbMock = vi.mocked(getDrizzleDb);
  const originalRateLimitMax = process.env.RATE_LIMIT_MAX;
  const limit = 2;

  beforeAll(async () => {
    process.env.RATE_LIMIT_MAX = String(limit);
    process.env.TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'test-token-secret';
    process.env.SESSION_SECRET =
      process.env.SESSION_SECRET ?? 'test-session-secret';
    getDrizzleDbMock.mockReturnValue(null);
    const { createApp } = await import('@server/app.js');
    app = createApp();
  });

  afterAll(() => {
    process.env.RATE_LIMIT_MAX = originalRateLimitMax;
  });

  it('does not rate-limit /api/health or /api/ready', async () => {
    for (let i = 0; i < limit + 3; i += 1) {
      const health = await request(app).get('/api/health').expect(200);
      expect(health.headers['ratelimit-limit']).toBeUndefined();
      const ready = await request(app).get('/api/ready').expect(503);
      expect(ready.headers['ratelimit-limit']).toBeUndefined();
    }
  });

  it('still rate-limits other /api routes', async () => {
    for (let i = 0; i < limit; i += 1) {
      await request(app).get('/api/hello').expect(200);
    }
    await request(app).get('/api/hello').expect(429);
  });
});
