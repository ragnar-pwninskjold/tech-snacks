# Postlane CLAUDE.md — One-Shot Example

This is a complete, real-world example of what a well-written CLAUDE.md looks like for a solo-founder SaaS. It is the **target shape** the skill is aiming at, but it is NOT a template to fill in.

**Why it works:**
- Every line either documents an *edge case*, a *non-obvious choice*, or a *footgun*.
- It does NOT restate things derivable from `package.json`, `tsconfig`, the README, or the directory tree.
- It assumes Claude can already read the codebase — its job is to add the context Claude *can't* infer.
- Constraints come with reasons (`see PR #142`, `Modal cold starts return 503`) so future Claude can judge edge cases.

**Use this example to:**
- Calibrate the *tone* (terse, opinionated, reason-bearing).
- See how the 8 sections relate (Stack → Commands → Architecture → Conventions → Hard constraints → Pointers → Auto-loaded → Gotchas).
- Recognize what *kinds* of facts belong in each section — not to copy specific facts.

---

````markdown
# Postlane

A solo-founder SaaS that turns long YouTube videos into a week of short-form clips + scheduled social posts. Indie scale (target: 500 paying users at $39/mo), so we optimize for **shipping speed + low operational surface area**, not enterprise patterns. Pick boring tech, lean on managed services, automate what hurts.

## Stack
- **Runtime:** Node 22 (NOT bun — Stripe SDK has flaky webhook signature edge case on bun as of v1.2.4, see PR #87)
- **Package manager:** `pnpm` only. Never `npm`, never `yarn`. The lockfile is `pnpm-lock.yaml` — if you see `package-lock.json` appear, delete it.
- **Framework:** Next.js 15.3 (App Router). React 19.
- **DB:** Postgres 16 on Neon. ORM is **Drizzle**, not Prisma. (We migrated off Prisma in Jan 2026, see `docs/decisions/0004-drizzle.md`.)
- **Auth:** `better-auth` 1.2.x. Not NextAuth, not Clerk.
- **Payments:** Stripe (subscriptions + metered usage for video processing minutes).
- **Email:** Resend. Templates are React Email components in `emails/`.
- **Background jobs:** Inngest. No BullMQ, no Trigger.dev, no cron Vercel functions for jobs >10s.
- **Video processing:** offloaded to a Modal.com endpoint (`infra/modal/transcode.py`). Don't run ffmpeg locally or in Next routes.
- **Deployment:** Vercel (web), Modal (video), Neon (db). All envs in `.env.example`.

## Commands
- `pnpm dev` — local dev (Next on :3000, drizzle-kit studio on :4983)
- `pnpm test` — Vitest
- `pnpm test path/to/file.test.ts` — single file, **always prefer this** over full suite when iterating
- `pnpm test:e2e` — Playwright (runs against `pnpm dev:test`, separate DB)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — Biome (not ESLint, not Prettier — one tool, configured in `biome.json`)
- `pnpm db:generate` — generate migration from schema diff
- `pnpm db:migrate` — apply pending migrations
- `pnpm build` — production build

## Architecture (only what isn't obvious)
- **All DB access goes through `lib/db/queries/*.ts`.** Routes and components never import from `drizzle-orm` directly. This makes mocking trivial and keeps query patterns consistent.
- **Server Components by default.** A file gets `"use client"` only when it needs state, refs, or browser APIs. If you're tempted to add `"use client"` to fetch data — don't, fetch it on the server and pass it down.
- **Auth lives in `lib/auth.ts`** (a `better-auth` instance). Get the session with `await auth.api.getSession({ headers: await headers() })` — never read cookies manually.
- **The Stripe webhook handler** is at `app/api/webhooks/stripe/route.ts`. It is the **only** route that uses the raw request body (`req.text()` before parse). Do not "refactor for consistency" — signature verification breaks if the body is parsed first. See PR #142.
- **Video jobs flow:** upload → Inngest event → Modal endpoint → S3 → Inngest event → DB update → Resend email. Never call Modal directly from a Next route — always go through Inngest so retries + observability work.
- **Feature flags** are in `lib/flags.ts`, env-driven. To add one: extend `FlagsSchema`, add to `.env.example`, ship.

## Conventions
- **TypeScript strict.** No `any` — use `unknown` and narrow.
- **Named exports only.** Default exports only for `page.tsx`, `layout.tsx`, `route.ts` (Next requires them).
- **Routes return typed `Response`**, not `NextResponse.json` with implicit any. Use the `ok()` / `fail()` helpers in `lib/http.ts`.
- **Errors:** throw `AppError` (in `lib/errors.ts`) with a code + status. The global error boundary maps codes to user-safe messages. Never `throw new Error("...")` from a route — codes won't map.
- **Zod for every external boundary.** Request bodies, URL params, env vars, third-party API responses. Internal function args don't need it.
- **Tests required for anything in `lib/`.** UI components are covered in Playwright instead.
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`). The `release-please` bot parses these; non-conforming messages break the release PR.
- **Plan mode** is required for changes touching `lib/billing/**`, `app/api/webhooks/**`, or DB schema. Use it freely elsewhere too — it's free.
- **Never use `process.env.X` directly** outside `lib/env.ts`. The Zod-parsed `env` object is the only legal access path — it fails loudly on missing vars at boot instead of silently at runtime.

## Hard constraints
Most of these are also enforced by deny rules in `.claude/settings.json` or pre-commit hooks. Listed here so the intent is clear.

- **Never modify `drizzle/migrations/*.sql` after they're committed.** Generate a new migration. Editing past migrations corrupts the journal and breaks prod deploys.
- **Never commit secrets.** Real values live in Vercel / Neon dashboards. `.env.example` is the only env file in git. *(Enforced: pre-commit hook.)*
- **Never run `pnpm db:push` against any DB whose URL contains `prod` or doesn't end in `_dev`.** Use migrations. *(Enforced: deny rule.)*
- **Never `git push --force` to `main`.** Force-push to feature branches is fine. *(Enforced: deny rule.)*
- **Never disable a test to make CI green.** Either fix the code, or `.skip` it with a comment linking an open issue.
- **Never call `revalidatePath('/')`** — it nukes the whole cache and tanks p95 for ~30s on Vercel. Revalidate the specific path or use tags.
- **Never add a `useEffect` to fetch data in a component.** If you think you need to, you probably want a Server Component or a Server Action. Ask before adding one.
- **Never modify files in `app/(marketing)/`** without checking with me — marketing pages are A/B tested and changes invalidate experiments.

## Pointers to deeper docs
Referenced (not auto-loaded) — open these when relevant.

- `docs/architecture.md` — full system diagram + data flow
- `docs/decisions/` — ADRs. Read `0001-app-router.md`, `0004-drizzle.md`, `0007-inngest.md` before proposing alternatives to those choices.
- `AGENTS.md` — same conventions, tool-neutral. Updated when Cursor/Codex usage drifts from CLAUDE.md.

Auto-loaded only when relevant files are touched:
- `.claude/rules/database.md` — loads on `*.sql`, `lib/db/**`, and migration changes
- `.claude/rules/billing.md` — loads on `lib/billing/**`, `app/api/webhooks/stripe/**`

Common procedures live as skills in `.claude/skills/` (add-db-column, add-api-route, deploy-preview, rotate-secret) and trigger automatically based on the request.

## Gotchas (tribal knowledge — add to this as you find more)
- **The retry logic in `lib/inngest/transcode.ts` looks broken** (it swallows the first failure silently). It's load-bearing — Modal cold starts return a 503 on the first request after >5min idle, and we don't want that paging us. Don't "fix" it. See PR #198.
- **`better-auth` session cookies are HTTP-only and lax-samesite.** Cross-subdomain auth (e.g. `app.postlane.com` → `api.postlane.com`) doesn't work out of the box. We handle it in `middleware.ts` by proxying. If you're adding a new subdomain, that proxy needs an allowlist entry.
- **Next 15 changed caching defaults** — `fetch()` is no longer cached by default (was cached in Next 14). If you're porting code from a tutorial older than mid-2025, it's almost certainly missing `{ cache: 'force-cache' }` or `next: { revalidate: N }`.
- **React 19 + Sentry:** Sentry's React error boundary doesn't catch errors in Server Components (different render path). For SC errors, rely on the `error.tsx` boundaries Next provides; Sentry picks them up via the server SDK.
- **Drizzle's `.returning()` is silently a no-op on MySQL drivers** but works on Postgres. We're Postgres-only, so it's fine — but don't be surprised if you copy-paste from a Drizzle MySQL tutorial.
- **Stripe webhook signature verification fails on Vercel Edge runtime** because Edge doesn't expose the raw body the same way. The webhook route is pinned to `runtime = 'nodejs'`. Don't change it.
- **Inngest's local dev server eats port 8288.** If `pnpm dev` complains about it, you have a stale `inngest-cli` process — `pkill -f inngest`.
- **`emails/` React components must not import from `lib/` or `app/`.** Resend renders them in a separate context without access to env/db. Pure components only.
- **The `users` table has a `deleted_at` column.** All queries must filter it (`isNull(users.deletedAt)`) — the `getUser()` helper in `lib/db/queries/users.ts` does this for you. If you write a raw query, you must do it manually.
````

---

## What to copy from this example

**The structure** — 8 sections in this order:
1. **Header paragraph** — product, scale, optimization stance (1 short paragraph)
2. **Stack** — technology choices *with reasons or rejected alternatives*
3. **Commands** — actual commands the human runs, with usage hints
4. **Architecture** — non-obvious structural rules (the parenthetical "only what isn't obvious" is the whole point)
5. **Conventions** — coding patterns with rationale
6. **Hard constraints** — "never X" rules, each with a reason or enforcement note
7. **Pointers to deeper docs** — references, not content
8. **Gotchas** — tribal knowledge, ideally with PR references

**The voice** — terse, opinionated, reason-bearing. Every assertion has a *because*.

**The discipline** — if a fact is derivable from the code, it's omitted. The file's job is the *un-derivable*.

## What NOT to copy from this example

- The specific stack (Next.js, Drizzle, Inngest, Modal) — that's Postlane's, not the user's
- The specific gotchas — those are bug-fix archaeology from Postlane's real history
- The PR numbers, file paths, and command names — all project-specific
- The "solo-founder SaaS" framing — that's a positioning, not a template
