# Backend observability & security

Lightweight standards for logs, rate limits, health checks, and dependency review. Complements **`backend-patterns.md`** and **`database-constraints.md`**.

## Logging (privacy-safe)

**Do not log**

- Full **note** bodies, **passwords**, **tokens**, **session cookies**, **Authorization** headers, or raw **OIDC** callback query strings.
- Entire **`req.body`** on auth or note endpoints.

**Preferred structured fields**

- **Counts** and **booleans** (e.g. batch `itemCount`, `hasDeviceId`, `durationMs`).
- **Identifiers** at coarse granularity (`savedId`, `userId` only when needed for incident correlation—follow data-retention policy).
- **Error types** without embedding user content (`err.message` from known `ClientError` is usually OK; avoid logging full `Zod` issue values that echo raw input).

**Existing patterns**

- Reader chapter: `durationMs`, book/chapter/translation (see `reader-controller`).
- Saved batch / note errors: scope flags + `err` object (ensure `onError` paths never attach `req.body`).

## Rate limiting

Configured in **`server/app.ts`** via **`RATE_LIMIT_WINDOW_MS`**, **`RATE_LIMIT_MAX`** (reads), **`RATE_LIMIT_WRITE_MAX`** (mutations), and a stricter cap under **`/api/admin`**.

**When to raise limits**

- New **mutation-heavy** UI flows (frequent autosave, rapid bookmark ticks) cause **429** in realistic use.
- Prefer **client debouncing** and **idempotent** server handlers first; then bump **`RATE_LIMIT_WRITE_MAX`** (document the change in **`CHANGELOG.md`** and deployment env).

## Health & readiness

| Route                 | Use                                                    |
| --------------------- | ------------------------------------------------------ |
| **`GET /api/health`** | Liveness; cheap checks.                                |
| **`GET /api/ready`**  | Readiness; includes DB when **`DATABASE_URL`** is set. |

Use these from load balancers, deploy scripts, and first-line incident triage (see **`docs/development-workflow.md`** → Backend operations).

Both routes **skip the `/api` read rate limiter** (`isRateLimitExemptPath` in **`server/app.ts`**), so frequent platform health checks (e.g. **Render**) are not counted toward **`RATE_LIMIT_MAX`** and cannot receive **429**.

## Security checklist (recurring)

- **Helmet** + **CORS** + **`trust proxy`** settings remain appropriate after proxy or host changes (`server/app.ts`).
- **Session cookie**: `SESSION_COOKIE_SAME_SITE`, **`secure`** in production, TTL aligned with product (`server/config/env.ts`).
- **Admin routes**: Most admin JSON routes use **`requireAdminSession`** + DB **`admin`** role. **`GET /api/admin/scripture-sources`** is the exception: **Bearer JWT** verified with **`TOKEN_SECRET`**, **not** wired in the SPA — operators only; see **`docs/deployment/README.md`** (_Admin API authentication_).
- **Auth audit**: new flows use **`writeAuthAuditEvent`** with types from **`shared/auth-audit-contracts.ts`**.
- **SQL**: Drizzle query builder only; no string-concat SQL with user input.

## Supply chain

- Before merging large **dependency** or **auth** changes: run **`pnpm audit --audit-level high`** locally.
- A **scheduled GitHub Action** (`.github/workflows/audit-scheduled.yml`) runs the same check on a weekly cadence; failures are visible in the Actions tab (not required on every PR).

## Seeds & scripts

- **`pnpm run db:seed`** (`server/scripts/seed.ts`) targets **`emotions`** and **`scriptures`** (support content). After **`server/db/schema.ts`** changes to those tables or required columns, update the seed path and run seed against a fresh DB in CI or locally.
- Corpus import: **`db:sync:bible-sources`** / **`db:import:bible-json`** — keep env vars documented in **`server/.env.example`**.
