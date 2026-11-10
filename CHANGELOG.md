# Changelog

All notable changes to this template are documented in this file.

The format is inspired by Keep a Changelog and uses semantic-style version sections for template milestones.

## [Unreleased]

### Added

- Client: **`tailwind-merge`** in **`cn()`** (`@/lib/cn`) so shared `Button` / layout classes resolve conflicting Tailwind utilities correctly.
- Client: **`@types/node`** (dev) for tests that read **`index.css`** from disk; **`reader-typography-css.guard.test.ts`** asserts immersive bottom-pad token and verse-row reader font CSS; **`App.test`** covers immersive chrome hide-on-scroll / show-on-click and verse **`reader-size-*`** classes from stored prefs.
- Reader: **Immersive full screen** — chapter controls moved to a **bottom** bar with safe-area padding; **Exit full screen** stays hidden until a **timeout** (immediate when `prefers-reduced-motion: reduce`) or a **click** on the immersive shell (same click shows the bottom bar). **Verse text** controls open **verse actions**; shell clicks alone **do not** open verse actions. Clicks on **modals** or the **bottom bar** do not run that reveal. Telemetry: `reader_immersive_exit_revealed` with `reason: 'surface_click' | 'timeout'`. New chapter loads **scroll to top** when there is no saved scroll offset for that chapter key (fixes next/previous leaving the viewport scrolled). See **`docs/proposals/reader-immersive-chrome-scroll.md`**.
- Client: **Global Bible translation** preference in **`localStorage`** (`app:preferred-translation:v1`); Support, Search, and Reader stay aligned. Reader seeds from `translation` in the URL once when unset, then the saved preference overrides shared links. Outbound **Study online** links (Bible.com + BibleGateway) on Support replace the inline Learn context panel; tutorial copy and dark-mode styles for tutorial prose/callouts updated. See **`docs/proposals/translation-support-tutorial-study-links.md`**.
- Reader: **Reader tools** sheet (bottom sheet on narrow viewports, centered modal on `md+`) with **Full screen** (Fullscreen API + fixed overlay fallback) and **Reader options** when comfort is enabled; click chapter scroll area opens tools without triggering verse actions (`stopPropagation` on verses). Telemetry: `reader_mobile_tools_*`, `reader_fullscreen_entered` / `reader_fullscreen_exited`. See **`docs/proposals/reader-mobile-fullscreen.md`**.
- Reader: **Full screen** stays active while **previous/next chapter** loads (immersive shell no longer unmounts on `isLoading`); in-immersive loading hint and disabled chapter nav until the fetch finishes.
- Reader: **Verse actions** and **note** modals stack above immersive full screen via a portal host at **`z-[80]`** (above bottom chrome **`z-[75]`**) so full screen is kept; **Reader options** (from **Reader tools**) / setting-help still exit immersive so those dialogs remain usable.
- Reader: verse/note modals are **portaled inside the immersive shell** so they appear during **native** browser fullscreen (only the fullscreen element’s subtree is visible to the compositor).
- Client: **`viewport-fit=cover`** on the root viewport meta for safe-area insets with immersive reader.
- Client: **`jest-axe`** + **`@types/jest-axe`**; **`src/app-a11y.test.tsx`** — axe smoke after guest entry for Support, Search, Reader (John 3 / KJV), and Tutorial (no **serious** or **critical** violations; color-contrast limited under jsdom per jest-axe).

### Changed

- Auth: OIDC login redirect (`buildLoginRedirectUrl` in **`server/services/auth-service.ts`**) now sends **`prompt=select_account`** so users get the provider account picker on each login (aligned with workout-tracker OIDC behavior).
- Reader: **Reader tools** on the chapter card uses the **primary** button style and a larger label so it reads as the main action.
- Reader: **Verse** reading style applies **Reader options → Font size** (and line height) to each verse row by setting typography from the same CSS variables as the chapter text.
- Reader: Removed the top-of-page **Options** button; **Reader tools** → **Reader options** is the only in-page entry to reader comfort settings on `/reader`.
- Reader: **Immersive** scrollable column uses **`--reader-immersive-bottom-chrome-pad`** on **`.reader-immersive-shell`** (see **`index.css`**) instead of a magic `5.25rem` only in JSX; bottom chrome uses **`aria-hidden`** when visually hidden.
- Reader: Programmatic-scroll suppress uses a **generation counter** so stacked **`scheduleClearImmersiveChromeScrollSuppress`** double-`rAF` callbacks do not clear the flag early; **`pageshow`** restore sets suppress only when **immersive** is active.
- Reader: **Immersive full screen** bottom chapter bar **hides while scrolling** and stays hidden until the user **clicks** the immersive shell again (same gesture as revealing Exit); a short scroll gesture does not reveal chrome.
- Reader: **Immersive** verse **actions** sheet uses a **centered** layout on small viewports (bottom-sheet layout unchanged in the normal reader card); the modal portal host uses **`z-[80]`** so the sheet sits above the bottom prev/next/exit bar (**`z-[75]`**).
- Reader: Verse actions open only when the user activates the **verse text** (verse number and note markers are not triggers); in **immersive** full screen, tapping empty reading surface no longer opens verse actions for verse **1** or `?verse=`.
- Reader: Verse / standard / clean **sup** markers use **`em`**-based sizes so they scale with reader body text.
- Support (**Emotions** home + **emotion scripture** viewer): **dark mode** forces light ink (**`#f8fafc`**) for emotion theme utilities (`text-indigo-*`, `text-red-*`, etc.) via **`.emotion-support-page`** so copy stays readable on the dark shell (global dark rules only rewrote **`text-slate-*`** before).
- GitHub Actions: **`.github/workflows/main.yml`** runs **`pnpm run lint`**, **`tsc`**, **`test`**, then **`build`** before EC2 rsync (parity with PR CI).
- Server: **`readEmotionScripturesBySlug`** batches primary-translation verse rows in **one** `OR` query, then falls back per row for incomplete hits or translation fallback (`emotion-service`).
- Server: Reader cross-book **prev/next** uses **grouped** `min`/`max` chapter queries over candidate books instead of sequential per-book aggregates (`reader-service`).
- Client: **`TutorialPage`** loads each tutorial MDX section with **`React.lazy`** and **`Suspense`** so sections code-split in production.

### Documentation

- **`docs/proposals/reader-immersive-chrome-scroll.md`** — immersive bottom bar / **Exit full screen** re-show via **shell click** (not modal or bottom bar); telemetry reasons **`surface_click`** and **`timeout`**.
- **`docs/emotion-high-contrast-spot-check.md`** — manual checklist for Support / emotion scripture routes with **High contrast**; **`docs/README.md`** index entry added.
- **`docs/development-workflow.md`** — _GitHub: branch protection (`main`)_; _EC2 / `pub` deploy_ documents **lint / tsc / test / build** on deploy; diagnostics `curl` still references deployment guide for Bearer token.
- **`docs/README.md`** — index note for branch protection + `pub` deploy; testing entry mentions **`app-a11y.test.tsx`** (jest-axe).
- Plans: **`docs/plans/full-app-review-2026.md`** — findings **F1–F9** addressed (**F4–F7** closed with code changes; slices 3–5 tables updated).
- Deployment / security docs: **`docs/deployment/README.md`** — _Admin API authentication_ (scripture diagnostics **Bearer `TOKEN_SECRET` JWT**, ops-only / not SPA; session **admin** for users/events/role); example token + `curl`.
- Saved scriptures: **`docs/verse-search-save.md`** — guest **`x-device-id`** threat model; endpoint note points to deployment auth section.
- **`docs/configuration.md`** — safety note linking guest saves + device id to verse-search-save.
- **`docs/styleguide/backend-observability-security.md`** — admin route auth split (scripture-sources vs `requireAdminSession`).

### Fixed

- **Rate limiting / Render health checks:** **`/api/health`** and **`/api/ready`** now skip the **`/api`** read rate limiter (via the limiter's **`skip`** option, matching on **`baseUrl + path`**), so frequent platform health checks no longer get **429** and use up the shared budget. Other **`/api`** routes stay limited; **`RATE_LIMIT_MAX`** / **`RATE_LIMIT_WINDOW_MS`** are unchanged. Vitest **`server/routes/api-rate-limit.test.ts`**.
- Reader: chapter picker on small screens no longer defaults the `<select>` to chapter **1** when the chapter number field is empty while the loaded chapter is something else; URL sync for book/chapter/translation updates the query string only when those values change (preserves `verse` and other params). Hydration from the URL runs only when `searchParams` change so local book/chapter/translation changes are not overwritten by a stale query string before it updates. URL hydration uses functional `setState` only when parsed params differ, and the URL-write effect skips `setSearchParams` when the query already matches state, to avoid update churn that could freeze the tab.

### Documentation

- Proposals: **`docs/proposals/full-application-review.md`** — phased full-stack review scope (code/docs cleanup, FE/BE optimization, functionality and test gaps, security, a11y, supply chain, telemetry, CI/release); listed in **`docs/proposals/README.md`**.
- Plans: **`docs/plans/full-app-review-2026.md`** — review progress tracker (Slice 1: SPA routes, API/client parity, journey matrix, initial finding on admin scripture-sources); **`docs/plans/backend-db-review-inventory.md`** updated with prayer API rows, admin role patch, and SPA client list.
- Plans: **Slice 2** (security / authz / IDOR) recorded in **`docs/plans/full-app-review-2026.md`** — session vs router middleware, API access classes, saved/prayer/reader ownership notes, findings **F2** (dual admin auth: Bearer vs session admin) and **F3** (device id threat model for guest saves).
- Plans: **Slice 3** (backend queries / transactions / indexes) in **`docs/plans/full-app-review-2026.md`** — transaction inventory (saved scriptures, prayer, admin role), alignment with **`docs/styleguide/database-constraints.md`**, reader vs emotion query notes; findings **F4** (emotion list N parallel verse fetches), **F5** (reader cross-book scan, P4).
- Plans: **Slice 4** (frontend abstractions / perf) in **`docs/plans/full-app-review-2026.md`** — lazy routes vs eager shell, centralized `api-client`, reader URL sync + Search sessionStorage, Reader abort/cancel patterns vs ad hoc effects; finding **F6** (tutorial static MDX imports, P4).
- Plans: **Slice 5** (a11y / telemetry / deps) in **`docs/plans/full-app-review-2026.md`** — modal/focus/reduced-motion patterns, full `trackEvent` inventory vs styleguide + reader comfort tests, `pnpm audit` workflow + `onlyBuiltDependencies`; finding **F7** (no axe/Playwright a11y automation, P4).
- Plans: **Slice 6** (code + docs cleanup) in **`docs/plans/full-app-review-2026.md`** — TODO/FIXME absent in app sources, eslint-disable triage, large-page pointers; **README** + **`docs/configuration.md`** aligned with actual **`install:env`** / **`postinstall`** (removed nonexistent **`setup:env`** / **`validate:env`**); **`docs/architecture.md`** route summary + **`docs/README.md`** testing section.
- Plans: **Slice 7** (CI / release hygiene) in **`docs/plans/full-app-review-2026.md`** — **`ci.yml`** jobs vs local parity, advisory audit workflow, **`main.yml`** EC2 **`pub`** path vs quality gates; findings **F8** / **F9** closed in **`docs/development-workflow.md`** runbook sections.

### Changed

- `docs/development-workflow.md`: local dev step no longer claims **`pnpm run dev`** runs bundled env-file validation; CI section notes **PR-only** triggers and branch-protection guidance.
- README and `docs/configuration.md`: local env setup documents **`pnpm run install:env`** (and root **`postinstall`**) plus optional **`client/.env.local`** copy from **`client/.env.example`**; removed references to nonexistent **`setup:env`**, **`setup:env:force`**, and **`validate:env`**.
- `docs/architecture.md`: authenticated route summary points to full surface in `client/src/App.tsx` (prayer, shared verse, etc.).
- `docs/README.md`: **Testing** subsection links **`docs/development-workflow.md`** and client/server test entry commands.
- Server: `errorMiddleware` maps common `DrizzleQueryError` + Postgres codes (`3D000` missing database, `42P01` missing relation, `08*` connection class) to **503** with actionable messages instead of a generic 500; `docs/development-workflow.md` troubleshooting for `/api/emotions` failures.
- UI: Display settings adds **Reading colors** (Light / Sepia / Dark) mirroring Reader → Options → Theme (`saveReaderPreferences`); Cancel restores the theme from when the modal opened; link to Reader for font/spacing options. Tutorial + Reader Options help text updated.
- UI: `ReaderSurface` uses `reader-content` (theme background + border) so Support and Saved verse blocks show sepia/light/dark reader colors correctly in app dark mode; `index.css` prevents merged slate utilities from overriding embedded reader borders and verse text color.
- UI: shared `Input` skips default full-width classes for `type="checkbox"` / `type="radio"` so inline toggles (e.g. Display settings) stay compact.
- Reader: `buildReaderChapterQuery` / `translationForReaderChapter`; Full Context and Support show an informational toast when opening Reader with a translation the app does not bundle (KJV, ASV, WEB only).
- Reader: hybrid reading UX — Support (`EmotionScripturePage`) and Saved book detail wrap verse text in `ReaderSurface` (live reader theme prefs via `reader-preferences-changed`); chapter controls stack on small screens with a chapter `<select>` on mobile; saved verses in a chapter show distinct highlighting in `ReaderChapterContent`; opening Reader from Support shows a **Support verse** callout (`ReaderSupportVerseCallout`). Full Context **Read full chapter** opens in-app Reader; **Open on BibleGateway** remains secondary. Shared `buildReaderChapterSearchParams` / `resolveReaderChapterLocation`; `saveReaderPreferences` dispatches same-tab sync event; `readerPreferencesClassNames` helper.
- Prayer list detail: removing a member requires `ConfirmModal` confirmation; member rows and notes use `min-w-0` / `break-words` for large text; prayer partners hub cards and forms tightened similarly. App `main` and shared `Input` use `min-w-0` / full width to reduce horizontal overflow.
- Devcontainer: added `name`, JSONC notes on local-open + `workspaceFolder` bind mount; README clarifies opening the local clone before **Reopen in Container**.
- Client: after logging a prayer list session, dispatch `app:prayer-insights-invalidate` so hub pages refresh streak/insights data (`prayer-insights-events.ts`, `usePrayerPageInsights`).
- UI: prayer insights load-error line uses `prayer-insights-inline-status` for dark mode + high contrast in `client/src/index.css`.
- Client: track `client/src/features/prayer/*` (insights API, hooks, hub bar, filter modal shell, reminder modal) used by prayer hub pages.
- UI: shared labeled `Select` primitive (`client/src/components/ui/Select.tsx`) for prayer filter modals; styleguide note under Form and Selector Consistency.
- Prayer hub hardening: IANA timezone validation for reminders (`server/lib/iana-timezone.ts`, Zod `superRefine` + service defense-in-depth; explicit `UTC`/`GMT` aliases because Node may omit them from `Intl.supportedValuesOf`); shared `usePrayerPageInsights` + `PrayerFilterModalShell`; toast + `role="status"` when insights fail; `trackEvent('prayer_reminder_settings_saved')`; deploy smoke check for `GET /api/prayer/insights` without session; route tests for auth/validation edges; styleguide/database docs updated.
- Prayer Partners and Prayer Lists pages: roster/list filters moved into a **Filters** modal; added a shared **Streaks & reminders** card (UTC-day streaks from list sessions, in-app daily reminder settings); improved mobile stacking and touch targets for actions.
- Cursor rules: added examples to `honest-feedback-on-ideas`; clarified scope, cross-links, and doc pointers across pre-commit, release, secrets, auth, API, DB, and frontend rules; added rule-relationship map to `docs/rules-registry.md`.
- Cursor rules: aligned with current stack (reader/CSS guardrails, `features/` layout, `asyncHandler`/validation, MSW handlers, auth-audit contracts, NOT VALID/VALIDATE, VITE rollout, audit workflow).

### Added

- Server: root scripts `db:sync:bible-sources`, `db:import:bible-json`, `db:import:bible-translations`; `db:import:bible-translations` loads bundled `server/data/bible/{kjv,asv,web}.json` into `scripture_verses`; shared `bible-corpus-db-import` + `bible-json-map-reference`; Reader chapter API falls back to local JSON when the DB is missing or has no rows for that translation; `server/data/bible/README.md` and `server/.env.example` notes for corpus workflows; admin `GET /api/admin/scripture-sources` includes `readerChapterBundledFallback`; `docs/deployment/README.md` pre-deploy runs `db:import:bible-translations`; `local-bible-reader-chapter.test.ts` for bundled Genesis 1 + chapter bounds.
- Client: tutorial MDX for **Learn context**, **Display settings**, and **Prayer partners & lists** (`07`–`09` sections); expanded Saved + Support copy; Support home links to `/tutorial`; `SettingHelpButton` + `SettingHelpModal` on Prayer hub/detail pages, Full Context, Shared Verse, and **Saved** index; prayer partner/list **Delete** and partner **note Delete** use `ConfirmModal` instead of `window.confirm`; `ConfirmModal` supports `confirmPendingLabel`, `titleId`, and default busy label **Removing…**; tutorial wrap-up reminders for Display + Prayer; styleguide note; `App.test.tsx` coverage for tutorial link, Saved help, and prayer partner + list delete confirms.
- Client: session `sessionStorage` route snapshots for Search, Saved index, and Prayer Partners (`client/src/lib/route-session-state.ts`); reader last location + chapter scroll persistence (`last-reader-location.ts`, `ReaderNavLinkButton`, `BibleReaderPage`); tutorials as MDX with thin components (`client/src/content/tutorial/sections/*.mdx`, `client/src/components/tutorial/*`, `@mdx-js/rollup` + `eslint-plugin-mdx`); `public/tutorial/` placeholder + README for screenshots.
- Client: route snapshots for **Saved book detail**, **Prayer partner detail**, **Prayer list detail** (scroll; list detail also restores add-member selection + prayer note draft); **cross-tab** last reader via `localStorage`; tutorial MDX split into numbered sections + `TutorialFigure` WebP-first with SVG fallback; tests for `route-session-state`, `ReaderNavLinkButton`, and last-reader localStorage.
- Prayer insights and reminders: migration `0018_user_prayer_settings.sql` + `user_prayer_settings` table (Drizzle + `database/schema.sql` parity); `GET /api/prayer/insights` and `PATCH /api/prayer/settings`; shared contracts in `shared/prayer-contracts.ts`; client modules under `client/src/features/prayer/` (insights API, reminder hook, modals, hub bar); route tests in `server/routes/prayer-api.test.ts`.
- Prayer List feature foundation:
  - shared contracts in `shared/prayer-contracts.ts`
  - schema + SQL parity updates for `prayer_partners`, `prayer_lists`, `prayer_list_members`, `prayer_sessions`, and `prayer_partner_notes`
  - migration `database/migrations/0017_prayer_partners_lists_foundation.sql` with journal update
  - backend prayer API routes/controllers/services for partner/list CRUD, note CRUD, list membership management (including reorder), and session logging
  - frontend routes/pages for Prayer Partners and Prayer Lists (including detail flows for notes, member ordering, and pray-now session logging)
  - backend route coverage in `server/routes/prayer-api.test.ts`
- Added Cursor rule `.cursor/rules/collaborative-flexibility-and-checkins.mdc` to codify strict invariants with implementation flexibility and mandatory user check-ins before meaningful scope/behavior changes.
- Reader comfort Phase 3–4 tracking and gates: `docs/plans/reader-comfort-phase-3-4.md`, `reader-comfort-telemetry.ts` (+ unit tests) for rollout event payload shape, Reader Options note for global high contrast, and Vitest coverage (high contrast + reader theme classes, reduced motion class, app text scale with reader, telemetry privacy).
- Added `docs/styleguide/backend-observability-security.md` (logging, rate limits, health/ready, security checklist, seeds/audit notes).
- Added `.github/workflows/audit-scheduled.yml` (weekly + manual `pnpm audit --audit-level high`, advisory).
- Added route test for invalid `sourceMode` on POST `/api/saved-scriptures`.
- Added migrations `0015_validate_reader_saved_check_constraints.sql` and `0016_saved_scripture_chapter_scope_indexes.sql` (journal updated).
- Added `docs/styleguide/database-constraints.md` (DB ↔ Zod ↔ contract parity; index/query notes for `scripture_verses` and saved items).
- Added `SavedScriptureSourceMode` in `shared/saved-scripture-contracts.ts` for `sourceMode` fields.
- Added `shared/auth-audit-contracts.ts` as the single source for auth audit `eventType` / `outcome` literals (aligned with DB checks; re-exported from `admin-contracts`).
- Added `server/lib/scripture-verse-row.ts` (`mapScriptureVerseRow`) plus `server/lib/scripture-verse-row.test.ts` for shared reader + search verse mapping.
- Added `parsePersistedScriptureTranslation` and `normalizeReaderBookmarkFields` in `server/lib/scripture-normalization.ts` with unit tests in `server/lib/scripture-normalization.test.ts`.
- Added `server/lib/async-handler.ts` for consistent `next(err)` on async route failures; optional `onError` for structured logging.
- Added `server/lib/validation/pagination.ts` (`adminPaginationQuerySchema`, `normalizeAdminPaginationQuery`) for admin list endpoints.
- Added backend/DB hardening plan and Phase 0 inventory docs:
  - `docs/plans/backend-db-review.md`
  - `docs/plans/backend-db-review-inventory.md`
- Added `server/lib/validation/device-id.ts` (optional `x-device-id` parsing) for reuse across device-scoped APIs.
- Added optional `PG_POOL_MAX` env (default 10) and explicit pool `idle` / `connection` timeouts in `server/db/pool.ts`.

### Changed

- `docs/development-workflow.md`: troubleshooting for local `db:migrate` when Drizzle re-runs early migrations (`already exists` / journal out of sync).

### Fixed

- Local Auth0 + default Vite dev: documented and startup-warned when `AUTH_REDIRECT_URI` uses `:8080` but `CORS_ORIGIN` is `:5173` — the OIDC state cookie is stored for the SPA origin during proxied `/api/auth/login`, so the callback URL must match that origin (typically `http://localhost:5173/api/auth/callback`) unless the client uses `VITE_API_BASE_URL` pointed at `:8080`.
- Local OIDC callback: build the code-exchange callback URL from `AUTH_REDIRECT_URI` (not `req.protocol`) and only enable Express `trust proxy` in production, avoiding wrong `https` detection from forwarded headers that could break Auth0 token exchange.
- Prayer partner image validation now rejects base64/data URLs with explicit guidance to use hosted `http(s)` URLs, and frontend prayer partner forms now block unsupported image inputs before submit.
- Saved scripture batch/note error logging no longer referenced a removed helper (could surface as 500 on some error paths).

### Changed

- `docs/development-workflow.md`: CI parity table vs `ci.yml`, audit workflow pointer, transaction reminder.
- `docs/styleguide/backend-patterns.md`: rate-limit tunables + link to observability doc.
- Partial indexes on `saved_scripture_items` for authenticated vs device chapter queries; Drizzle schema and `database/schema.sql` aligned.
- Saved scripture API: `sourceMode` validated with `z.enum(['local', 'remote'])`; `toSavePayload` and grouped display mapping use shared source-mode types.
- `docs/development-workflow.md`: schema change / NOT VALID / EXPLAIN playbook; `database-patterns.md` links to `database-constraints.md`.
- Reader state service: bookmark read/patch uses shared scripture normalization; invalid bookmark book on patch returns 400; DB rows with unknown books or translations surface as no bookmark when read.
- Saved scripture service: persist and query by canonical Bible book name; translation normalization uses `normalizeScriptureTranslationCode`.
- Emotion service: translation fallback order derives from `SUPPORTED_SCRIPTURE_TRANSLATIONS`.
- Auth audit service and admin types consume `shared/auth-audit-contracts.ts`; Drizzle schema documents parity with that module.
- Scripture search (local DB) and reader chapter responses use `mapScriptureVerseRow` for verse payloads.
- Refactored admin, saved-scripture, emotion, and reader-state controllers to use `asyncHandler`; admin pagination uses shared validation module.
- Documented backend operations (health/ready, migrations, pool tuning, transactions, `pnpm audit`) in `docs/development-workflow.md`.
- Extended `docs/styleguide/backend-patterns.md` with Zod validation conventions, `asyncHandler`, pagination helpers, backend optimization-run triggers, and links to the plan docs.
- `PATCH /api/reader/state` validation errors now use the same Zod → error-middleware path as other endpoints (`details` as `issues`).
- Added reader chapter-control extraction for incremental decomposition:
  - `client/src/features/reader/ReaderChapterControls.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` without behavior changes.
- Added reader options modal extraction for incremental decomposition:
  - `client/src/features/reader/ReaderOptionsModal.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` without behavior changes.
- Added reader chapter content extraction for incremental decomposition:
  - `client/src/features/reader/ReaderChapterContent.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` while preserving existing reader interactions.
- Added reader verse actions modal extraction for incremental decomposition:
  - `client/src/features/reader/ReaderVerseActionsModal.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` while preserving existing actions behavior.
- Added reader note modal extraction for incremental decomposition:
  - `client/src/features/reader/ReaderNoteModal.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` while preserving note-edit flow behavior.
- Added reader chapter route-state hook for incremental logic decomposition:
  - `client/src/features/reader/useReaderChapterRouteState.ts`
  - integrated into `client/src/pages/BibleReaderPage.tsx` for chapter input/URL sync state management.
- Added reader account-sync hook for incremental logic decomposition:
  - `client/src/features/reader/useReaderAccountSync.ts`
  - integrated into `client/src/pages/BibleReaderPage.tsx` for local persistence + authenticated reader-state sync.
- Added reader verse-actions hook for incremental logic decomposition:
  - `client/src/features/reader/useReaderVerseActions.ts`
  - integrated into `client/src/pages/BibleReaderPage.tsx` for save/note/share action orchestration and modal state management.
- Added reader status/break reminder presentation extractions:
  - `client/src/features/reader/ReaderStatusBar.tsx`
  - `client/src/features/reader/ReaderBreakReminder.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` without behavior changes.
- Added reader chapter navigation extraction:
  - `client/src/features/reader/ReaderChapterNavigation.tsx`
  - integrated into `client/src/pages/BibleReaderPage.tsx` without behavior changes.
- Added centralized scripture normalization helper module:
  - `server/lib/scripture-normalization.ts`
  - shared canonical Bible-book aliasing and translation-code normalization used by scripture search, reader, and emotion services.
- Added centralized reader-preferences validation/normalization module:
  - `server/lib/reader-state-preferences.ts`
  - reused by reader-state controller and service to reduce contract drift risk.
- Added DB hardening migration:
  - `database/migrations/0014_reader_saved_constraints.sql`
  - introduces `NOT VALID` checks for `saved_scripture_items.sourceMode` and `reader_state.bookmarkTranslation`.
- Added reader styles + bookmarking + account-sync proposal:
  - `docs/proposals/reader-styles-bookmarks-account-sync.md`
- Added authenticated reader-state API surface:
  - `GET /api/reader/state`
  - `PATCH /api/reader/state`
  - `DELETE /api/reader/state`
- Added `reader_state` schema/migration foundation for account-synced reader preferences + single bookmark resume point:
  - `database/migrations/0012_reader_state_account_sync.sql`
- Added reader-state server route coverage:
  - `server/routes/reader-state-api.test.ts`
- Added reader UX behaviors:
  - `Reading style` selector (`verse`, `standard`, `clean`)
  - click-to-save bookmark with `Jump to last place`
  - account-aware reader state sync (`account_wins`) with local fallback
  - clear synced reader data control in Reader Options
- Added scripture reader + grouped-save rollout proposal:
  - `docs/proposals/scripture-reader-multisave-notes-rollout.md`
- Added backend reader and saved-scripture observability events:
  - batch-save success/failure logging (scope + batch size context)
  - reader chapter latency/success/failure logging
  - saved-note patch failure logging
- Added Phase 5 regression coverage:
  - reader next-chapter route behavior in `client/src/App.test.tsx`
  - grouped batch-save + note-edit flow coverage in `client/src/App.test.tsx`
  - note patch missing-row (`404`) and empty batch validation (`400`) in `server/routes/scripture-saved-api.test.ts`
- Added dedicated styleguide documentation directory `docs/styleguide/` with deeper implementation guides:
  - `docs/styleguide/ui-styleguide.md`
  - `docs/styleguide/code-patterns.md`
  - `docs/styleguide/frontend-patterns.md`
  - `docs/styleguide/backend-patterns.md`
  - `docs/styleguide/database-patterns.md`
- Added auth/admin expansion foundation:
  - `users` role/profile columns (`role`, `displayName`, `avatarUrl`) with constraints
  - `auth_audit_events` table with event/outcome checks and operability indexes
  - migration `database/migrations/0010_auth_roles_profiles_audit.sql`
- Added admin APIs and contracts:
  - `GET /api/admin/users`
  - `PATCH /api/admin/users/:userId/role`
  - `GET /api/admin/auth-events`
  - `shared/admin-contracts.ts`
- Added minimal admin UI route/page (`/admin`) with user-role management and recent auth event visibility.
- Added admin/session route tests in `server/routes/admin-api.test.ts`.
- Added focused Cursor rule files and rule tracking docs:
  - `.cursor/rules/style-enforcement-frontend.mdc`
  - `.cursor/rules/backend-api-boundaries.mdc`
  - `docs/rules-usage-guide.md`
  - `docs/rules-registry.md` updates for new rule entries
- Added split env-file workflow tooling for local setup:
  - `pnpm run setup:env`
  - `pnpm run setup:env:force`
  - `pnpm run validate:env`
  - `scripts/validate-env-files.mjs` for required key checks and auth-gated validation.
- Added configuration/style documentation:
  - `docs/configuration.md`
  - `docs/styleguide/ui-styleguide.md`
- Added Auth0 troubleshooting guidance for issuer discovery and application-authentication mode in:
  - `docs/deployment/auth0-setup.md`
  - `docs/deployment/README.md`
- Added full-bible JSON import script:
  - `pnpm run db:import:bible-json` (defaults to public-domain KJV JSON source)
  - `server/scripts/import-bible-json.ts` with URL/file override support and idempotent translation refresh.
- Added verse search and save feature foundation:
  - three-mode search support (`guided`, `reference`, `keyword`) with a new Search page
  - anonymous device-scoped saved scripture collection with a new Saved page
  - global accessibility controls for larger text and high-contrast mode
- Added backend scripture search/saved APIs:
  - `GET /api/scriptures/search`
  - `GET /api/saved-scriptures`
  - `POST /api/saved-scriptures`
  - `PATCH /api/saved-scriptures/:savedId`
  - `DELETE /api/saved-scriptures/:savedId`
- Added scripture source diagnostics endpoint:
  - `GET /api/admin/scripture-sources` for DB/local translation status and fallback readiness.
- Added new DB entities and migration for searchable verse corpus + saved references:
  - `scripture_verses`
  - `saved_scripture_items`
  - `database/migrations/0005_brisk_search_and_saved_scriptures.sql`
- Added shared contracts/utilities:
  - `shared/scripture-search-contracts.ts`
  - `shared/bible-books.ts`
- Added implementation documentation: `docs/verse-search-save.md`.
- Added deployment documentation hub `docs/deployment/README.md` with links to per-service account setup guides.
- Added service onboarding guides:
  - `docs/deployment/neon-account-setup.md`
  - `docs/deployment/render-account-setup.md`
  - `docs/deployment/vercel-account-setup.md`
- Added split-hosting guide `docs/deployment-vercel-render.md` for Vercel frontend + Render API + Neon DB deployment.
- Added frontend `VITE_API_BASE_URL` support via `client/src/lib/api-base-url.ts` to enable separate frontend/backend hosts without endpoint rewrites.
- Added `client/vercel.json` SPA rewrite config and `client/.env.example` for frontend deployment environment setup.
- Added Render Blueprint config at `render.yaml` for low-friction Node 22 web service deployment on free tier.
- Added Render+Neon deployment runbook at `docs/deployment-render-neon.md` with env, bootstrap, and smoke-test guidance.
- Added deployment smoke-test script `pnpm run smoke:deploy` (`scripts/smoke-deploy.mjs`) for `/`, `/api/health`, emotion/scripture, and context checks against a deployed URL.
- Added full emotion-scripture application baseline as default template experience:
  - emotion tile landing page
  - scripture viewer with fixed-order looping navigation
  - full-context route and chapter-reading actions
- Added shared frontend API client utilities in `client/src/lib/api-client.ts` to reduce duplicate fetch/error-envelope handling.
- Added scripture link helper module in `client/src/features/emotions/scripture-links.ts` for shared chapter parsing + BibleGateway URL building.
- Added backend graceful shutdown handling in `server/server.ts` with HTTP server close + DB pool close sequence.
- Added DB safety constraints/indexes:
  - lowercase slug check on `emotions.slug`
  - positive display-order check on `scriptures.displayOrder`
  - index on `scriptures.reference`
- Added transactional, advisory-lock protected seed behavior with upsert semantics in `server/scripts/seed.ts`.
- Added scripture-context API support for stable `scriptureId` lookup, with legacy `reference` compatibility.
- Added conversation running log at `docs/conversation-running-log.md`.
- Added unauthenticated landing experience with explicit entry options:
  - `Continue with Google`
  - `Continue as Guest`
- Added authenticated profile editing surface (`/profile`) with live avatar preview and field-level validation.
- Added lightweight client telemetry event hook utility at `client/src/lib/telemetry.ts`.
- Established backend layering with concrete examples:
  - `server/app.ts` for app composition
  - `server/routes/api.ts` for route modules
  - `server/controllers/system/hello-controller.ts`
  - `server/controllers/health/health-controller.ts`
  - `server/services/health-service.ts`
  - `server/db/pool.ts`
- Added `GET /api/health` endpoint demonstrating route -> controller -> service -> db flow.
- Added project documentation set under `docs/`:
  - `docs/README.md`
  - `docs/architecture.md`
  - `docs/project-structure.md`
  - `docs/development-workflow.md`
  - `docs/templates/feature-doc-template.md`
- Added CI workflow `/.github/workflows/ci.yml` for pull requests and manual runs.
- Added PR template `/.github/pull_request_template.md` with testing + documentation checklists.
- Added docs-policy CI gate requiring docs updates when application/config files change.
- Added pnpm workspace file: `pnpm-workspace.yaml`.
- Added pnpm lockfile: `pnpm-lock.yaml`.
- Added full test scaffolding with Vitest across frontend and backend.
- Added frontend unit test setup (`client/src/test/setup.ts`) and sample component test (`client/src/App.test.tsx`).
- Added MSW-based frontend API mock pattern (`client/src/test/handlers.ts`, `client/src/test/server.ts`).
- Added backend sample tests:
  - `server/services/health-service.test.ts` (service unit tests with mocked db layer)
  - `server/routes/api.test.ts` (API route tests via Supertest)
- Added `pnpm run test:changed` for fast local feedback by running only tests related to changed files.
- Added runtime pinning with `.nvmrc` and `engines` in root `package.json`.
- Added server environment validation module (`server/config/env.ts`) using `zod`.
- Added structured logging via `pino` and request logging via `pino-http`.
- Added Drizzle ORM + Drizzle Kit integration with schema/migration scaffolding.
- Added example Drizzle-backed CRUD endpoints for todos (`/api/todos`).
- Added idempotent database seed flow (`pnpm run db:seed`) and starter todo data.

### Changed

- Consolidated duplicate mobile `select` media-query rules in `client/src/index.css` to reduce cascade drift risk and keep a single canonical touch-target policy.
- Updated reader verse hover styling to rely on reader-scoped semantic interaction classes instead of `hover:bg-slate-*` utility coupling inside chapter text.
- Updated styleguide docs to codify Reader decomposition boundaries and extraction sequence in:
  - `docs/styleguide/frontend-patterns.md`
  - `docs/styleguide/ui-styleguide.md`
- Changed database schema parity for domain checks:
  - `saved_scripture_items.sourceMode` constrained to `local|remote`
  - `reader_state.bookmarkTranslation` constrained to `KJV|ASV|WEB|null`
- Changed Reader mobile UX polish:
  - Reader Options modal now supports internal scrolling with sticky top/bottom action regions on small screens.
  - Reader route cards now render full-width (edge-to-edge) on mobile while preserving inset card styling on `sm+`.
- Changed reader chapter navigation to support cross-book forward flow:
  - when a selected book reaches its last chapter, `Next chapter` now advances to chapter 1 of the next canonical book (if available for the active translation).
- Changed reader chapter navigation to support cross-book backward flow:
  - when a selected book is at chapter 1, `Previous chapter` now moves to the last chapter of the previous canonical book (if available for the active translation).
- Added Reader save-and-note workflow enhancements:
  - new `GET /api/saved-scriptures/chapter` endpoint for chapter-scoped saved rows.
  - Reader verse click now opens an actions modal with `Bookmark here`, `Save verse`, and `View/Edit note` (mobile bottom-sheet treatment).
  - Reader verse actions now include `Share verse`, which uses native share first with clipboard fallback.
  - Added public shared-verse route (`/verse`) with canonical query-param links and actions to open Reader/Search/Support.
  - Added share telemetry coverage for click/success/fallback/failure outcomes.
  - `standard` and `clean` reader modes now preserve paragraph flow while keeping per-verse segment selection for save/note actions.
  - Reader note editing now supports unsaved verses by auto-saving the selected verse before opening/saving note content.
  - Reader note indicator now appears per covered verse and opens a note modal for editing.
  - Reader chapter-saved lookups use abortable fetches to prevent stale navigation flashes during rapid chapter/book changes.
- Updated frontend helper/microcopy voice to a consistent hybrid tone (kind + practical) across current routes, including help modals, inline guidance, empty states, and status messages.
- Expanded Tutorial route into a robust onboarding guide with route workflows, shared-verse guidance, troubleshooting, and recommended next steps.
- Added lightweight shared copy-token module (`client/src/lib/copy.ts`) for recurring UI phrases to reduce wording drift.
- Changed scripture services to reuse shared canonical normalization helpers instead of maintaining duplicated local maps/parsers.
- Changed architecture/project-structure docs to reflect current route surface (`/search`, `/saved`, `/reader`, `/tutorial`, `/profile`, `/admin`) and active API endpoint groupings.
- Changed backend styleguide to document centralized reader-state preference schema usage.
- Changed database styleguide to include `NOT VALID` retrofit-constraint rollout guidance.
- Updated README API reference and MVP section for reader/grouped-save/note capabilities.
- Updated `docs/verse-search-save.md` to document grouped saves (`saveGroupId`), note constraints, reader route behavior, and observability guidance.
- Updated styleguide patterns (`frontend`, `backend`, `database`) with URL-state, observability, grouped-index, and note-constraint guidance for future extensions.
- Updated emotion scripture fallback resolution to use DB-first + local JSON range fallback before seed text, reducing placeholder exposure when corpus rows are missing.
- Updated seeded fallback verse copy to indicate temporary unavailability instead of instructional wording.
- Updated emotion scripture viewer to track the active verse in URL query state (`scriptureId`) so translation switches preserve the currently displayed scripture.
- Updated app-shell branding implementation by extracting shared `BrandLockup` and `MenuHeader` components to reduce JSX duplication and keep menu/header/modal brand treatment aligned.
- Updated brand typography implementation to semantic CSS classes (`app-brand-title*`) so fixed brand sizing is not affected by global text-scale utility remaps.
- Updated frontend styleguide guidance with Tailwind/MDN-aligned cascade rules and a formal large-update CSS/JSX review checklist.
- Updated support category seed set from `joy`/`peace` to `stress`/`guilt` with 20 curated references per category across all 8 support groups.
- Updated seed reconciliation behavior to prune deprecated emotion slugs and trim stale per-emotion scripture rows on rerun, keeping support data idempotent and drift-resistant.
- Updated support emotion theming/mocks to match the canonical category set (`fear`, `anger`, `sadness`, `anxiety`, `loneliness`, `grief`, `stress`, `guilt`).
- Updated app shell navigation to a single hamburger-triggered left overlay menu across desktop/mobile with backdrop blocking and menu-only auth controls.
- Updated menu information architecture to grouped sections (`Navigation`, `Account`, `Display`) with in-menu account identity (avatar + name).
- Updated shell/menu terminology from `Emotions` to `Support` for user-facing navigation labels.
- Updated home support copy to `Scriptural Support` and first-person emotion cards (`I Am ...`) for clearer user framing.
- Updated search mode chooser from button row to `Search Type` select input.
- Updated About page content to match current app behavior and added FAQ with quick route links.
- Updated login modal branding to use logo + `Scripture & Solace` title treatment.
- Updated mobile `XL` text-scale behavior to render larger typography for readability.
- Updated social login flow to modal-driven provider selection from the app shell.
- Updated app-shell navigation for desktop with left-side patterns:
  - overlay drawer on `md`/`lg`
  - pinned collapsible sidebar on `xl+`
- Updated global text scaling baseline so prior larger sizing maps to the new `Small` floor, with `Medium`/`Large`/`XL` scaled upward.
- Updated shell branding/title usage to `Scripture & Solace`.
- Updated auth login flow to preserve an optional route intent (`next`) through callback redirect markers.
- Updated auth API surface with `PATCH /api/auth/me` for editable profile metadata.
- Updated auth provider behavior to env-gated Facebook enablement via `AUTH_SOCIAL_FACEBOOK_ENABLED` (default `false`) while keeping Google enabled.
- Updated `/api/auth/me` to include `enabledSocialProviders` for client-side provider rendering.
- Updated styleguide references from single-file path (`docs/styleguide.md`) to directory-based docs under `docs/styleguide/`.
- Updated client document title and favicon to Bible Support branding, including new glowing Bible logo asset.
- Updated social login selector to support env-gated Facebook enablement via `AUTH_SOCIAL_FACEBOOK_ENABLED` (default `false`); Google remains enabled by default.
- Updated auth callback/account linkage to support `user_wins` profile metadata population (set provider `displayName`/`avatarUrl` only when local fields are null).
- Updated `/api/auth/me` payload contract to include role and optional profile metadata.
- Updated rate-limit identity keying to prefer authenticated user id with stable session/device/ip fallback and stricter admin-write throttling.
- Updated admin role enforcement to evaluate current DB role per request (immediate role-change propagation).
- Updated deployment/auth docs with first-admin grant, rollback, verify, and break-glass SQL runbook guidance.
- Updated Cursor rules activation strategy to keep only pre-commit/release gates always-on and scope domain-specific rules via file globs.
- Updated rules/process docs to explicitly defer pre-commit/release check execution while in planning mode, with checks run only in execution mode.
- Updated client lint policy to enforce alias-first cross-folder imports using `@/` (disallow deep parent-relative import patterns).
- Updated development workflow docs to treat CI docs/migration/quality jobs as hard merge gates.
- Updated auth login endpoint to return explicit endpoint-level auth failures (`sendAuthFailure`) instead of generic middleware error responses.
- Updated environment boolean parsing to correctly handle string values like `false`/`0` for `AUTH_ENABLED`, `DB_SSL`, and `DB_SSL_REJECT_UNAUTHORIZED`.
- Updated Express proxy trust configuration to one-hop mode (`trust proxy = 1`) for Render compatibility and correct callback protocol handling.
- Updated scripture search fallback normalization to keep canonical translation codes (`KJV`/`ASV`/`WEB`) across local and remote results.
- Updated accessibility controls to `Small`/`Medium`/`Large`/`XL`, plus mobile display-settings modal cancel rollback semantics for both text-size and high-contrast values.
- Updated admin diagnostics route protection so `/api/admin/scripture-sources` now requires bearer authentication.
- Updated route-level test coverage for scripture search/saved CRUD + translation patch + diagnostics authorization.
- Updated DB schema parity by aligning Drizzle schema checks/indexes with SQL/migration constraints and adding saved-items listing sort index support.
- Updated modal implementation consistency by introducing shared UI modal shell primitives and reusing them across display/translation/confirm dialogs.
- Updated auth callback semantics to return endpoint-level JSON errors for API clients while preserving browser redirect UX markers (`auth`, `reason`, `message`).
- Updated provider-declined callback handling to preserve existing app session (clear login-state cookie only).
- Updated logout UX to keep signed-in state when logout API fails and surface explicit error toast feedback.
- Added dedicated Auth0 setup guide and expanded deployment docs with auth environment variables, including `AUTH_LOGIN_REDIRECT_URI`.
- Updated saved-scripture uniqueness semantics so anonymous saves are constrained by device only when `ownerUserId is null`, while authenticated saves remain constrained by owner scope.
- Updated save-route ownership resolution so authenticated requests can operate without `x-device-id`, and migration bridge now runs consistently across read/create/update/delete flows when device id is present.
- Updated callback request logging to avoid leaking auth query payload on `/api/auth/callback`.
- Updated auth routes to include `GET /api/auth/logout` for browser redirect flows using `AUTH_LOGOUT_REDIRECT_URI`.
- Updated seed behavior to avoid writing seeded emotion verses into `scripture_verses`, preventing corpus translation drift.
- Updated search UI translation options to include `ASV` and use shared supported-translation constants.
- Updated saved-verse dedupe behavior in search UI to match backend uniqueness tuple semantics (translation/book/chapter/range).
- Updated shared contracts with canonical scripture translation constants and shared diagnostics response types.
- Updated docs/runbooks to include translation sync/import workflow and scripture diagnostics verification steps.
- Updated deployment docs to include split-hosting CORS guidance for separate frontend and API origins.
- Updated EC2 deploy workflow to run non-destructive hosted DB bootstrap (`pnpm run db:migrate` + `pnpm run db:seed`) instead of `db:import`.
- Updated README and docs workflow/structure content to include lightweight free-tier deployment guidance and post-deploy verification.
- Updated frontend scripture/context flow to use a single scripture list request and `scriptureId` for context fetches.
- Updated frontend async data-loading patterns with cancellation guards to avoid stale state writes after route changes.
- Updated emotion-page retry action to in-page refetch instead of full-page reload.
- Updated Toast provider lifecycle to clear pending timers on unmount.
- Updated server auth middleware to strict bearer-token parsing behavior.
- Updated read/write rate-limit middleware behavior to avoid write requests consuming read budget.
- Updated DB pool SSL configuration to environment-driven toggles (`DB_SSL`, `DB_SSL_REJECT_UNAUTHORIZED`).
- Updated docs to reflect preferred `scriptureId` context contract, transactional seed semantics, and DB workflow safety notes.
- Upgraded development environment:
  - Devcontainer uses Node 22 via feature (`ghcr.io/devcontainers/features/node:1`).
  - Devcontainer uses persistent bind mount to `/workspace` from local folder.
- Migrated package management from npm to pnpm:
  - Added `packageManager` in root `package.json`.
  - Converted root scripts to `pnpm` commands.
  - Updated Husky pre-commit to `pnpm exec lint-staged`.
  - Updated CI and deploy workflows to use pnpm setup/install/run.
  - Updated docs and README commands from npm to pnpm.
- Hardened CI/CD and project workflow:
  - Deploy workflow updated to `actions/checkout@v4`.
  - Deploy script changed from force push to normal push (`git push origin main:pub`).
  - Added docs-policy + quality checks in CI pipeline.
- Upgraded major runtime/tooling stacks:
  - React 19 + Vite 7 (`client`)
  - Express 5 (`server`)
  - Node 22 (devcontainer/CI)
  - TypeScript/ESLint ecosystem refresh across root + client
  - Husky v9-compatible prepare/hook behavior
- Refactored server startup into bootstrap/app composition split:
  - `server.ts` now focuses on process startup.
  - `app.ts` handles middleware/routes/static/error wiring.
- Updated Express fallback route for Express 5 compatibility:
  - from `*` to `/{*path}`.
- Updated README to match current stack, setup, CI, docs-policy, and pnpm workflows.
- Updated CI to run tests (`pnpm run test`) alongside lint, typecheck, and build.
- Added minimum coverage thresholds in Vitest configs for frontend and backend.

### Fixed

- Resolved empty workspace issue in devcontainer by introducing explicit workspace bind mount.
- Fixed GitHub Actions failure (`Unable to locate executable file: pnpm`) by adding `pnpm/action-setup` before `actions/setup-node`.
- Removed Husky deprecation warning source by deleting deprecated `/.husky/_/husky.sh` and modernizing hook usage.

### Removed

- Removed npm lockfiles:
  - `package-lock.json`
  - `client/package-lock.json`
  - `server/package-lock.json`

## [2.0.0] - Template Baseline

### Added

- Initial full-stack TypeScript template structure with:
  - React client (`client`)
  - Express server (`server`)
  - PostgreSQL scripts (`database`)
  - deployment workflow scaffold
