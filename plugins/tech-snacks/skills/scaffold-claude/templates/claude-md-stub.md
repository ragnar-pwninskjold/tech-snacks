# {{PROJECT_NAME}}

<!-- TODO: 1-2 sentence header. What is this project? What scale? What are you optimizing for (shipping speed, reliability, enterprise compliance, etc.)?
     Example shape: "A solo-founder SaaS that does X. Indie scale (target: N paying users). We optimize for shipping speed + low operational surface area, not enterprise patterns." -->

## Stack

<!-- TODO: List technology choices that aren't obvious from package.json/Gemfile/etc., OR are obvious but have a non-obvious *reason* (a rejected alternative, a version pin, a bug workaround).
     Skip this section entirely if every stack choice is standard and unsurprising — Claude can read package.json.
     What belongs here:
       - Choices made *against* the default (`pnpm only, never npm`)
       - Version pins with a reason (`Node 22 — bun has a Stripe webhook bug`)
       - "We migrated off X in <date>, see ADR-N"
       - Managed services and where they live (Vercel / Neon / Modal / Resend etc.)
     What does NOT belong here:
       - Listing every dependency in package.json
       - "We use React" with no further detail -->

## Commands

<!-- TODO: Commands you actually run, with usage hints. Not every npm script — just the ones an agent needs to know.
     Include hints that aren't in the script itself:
       - `pnpm test path/to/file.test.ts — single file, **always prefer this** over full suite when iterating`
       - `pnpm dev — local dev (Next on :3000, drizzle-kit studio on :4983)`
     Skip if `npm run` / `just --list` / a README already documents this well — point to that instead. -->

## Architecture (only what isn't obvious)

<!-- TODO: Non-obvious structural rules. Each bullet should answer: "what would a smart contributor get wrong on their first PR?"
     What belongs here:
       - Layering rules (`All DB access goes through lib/db/queries/*.ts`)
       - Defaults that flip from the framework norm (`Server Components by default`)
       - Single-purpose routes that look weird (`The Stripe webhook is the *only* route that reads the raw body — don't refactor for consistency`)
       - Data flows that span services (`upload → Inngest → Modal → S3 → Inngest → DB → Resend`)
     What does NOT belong here:
       - Generic "we follow MVC" — agents can see the structure
       - Restating what `app/`, `lib/`, `components/` contain — that's derivable -->

## Conventions

<!-- TODO: Coding patterns with rationale. The rationale is the whole point — without "because", these turn into cargo culting.
     What belongs here:
       - Strictness rules (`No any — use unknown and narrow`)
       - Export style (`Named exports only. Default only for page.tsx / layout.tsx / route.ts`)
       - Error patterns (`throw AppError, never throw new Error from a route — codes won't map`)
       - Boundary validation (`Zod for every external boundary. Internal args don't need it`)
       - Test policy (`Tests required in lib/, UI covered by Playwright`)
       - Commit / branch / plan-mode rules
     What does NOT belong here:
       - "Use Prettier" if Prettier is configured (the config file IS the convention)
       - "Write good code" — say what specifically -->

## Hard constraints

<!-- TODO: "Never X" rules. Each one needs a reason OR an enforcement note (or both).
     Pattern: `Never <action>. <Reason / what breaks>. *(Enforced: <how>.)*`
     What belongs here:
       - Things that corrupt state (`Never modify drizzle/migrations/*.sql after commit — corrupts the journal`)
       - Things that leak secrets (`Never commit secrets. .env.example is the only env file in git.`)
       - Production safety (`Never run db:push against any DB whose URL contains "prod"`)
       - Git safety specific to this repo (`Never git push --force to main`)
       - Anti-patterns that look reasonable but break this app (`Never call revalidatePath('/') — tanks p95 for ~30s`)
     If the rule is enforced by a deny rule, pre-commit hook, or CI check, *say so* — agents trust enforced rules more.
     If you have none of these, leave this section stubbed. Inventing constraints to fill space is worse than leaving it empty. -->

## Pointers to deeper docs

<!-- TODO: References (not content). Files Claude should read *when relevant*, not auto-load.
     What belongs here:
       - ADRs / decision logs (`docs/decisions/0004-drizzle.md`)
       - Architecture diagrams (`docs/architecture.md`)
       - Sibling tool-neutral docs (`AGENTS.md`)
       - Auto-loaded subset rules (`.claude/rules/database.md loads on lib/db/** changes`) — only if you actually have these set up
       - Skills directory (`.claude/skills/` for procedures)
     If you don't have any of these yet, leave it stubbed — don't fabricate paths. -->

## Gotchas (tribal knowledge — add to this as you find more)

<!-- TODO: Tribal knowledge. Bug-fix archaeology. Things that took someone 4 hours to figure out.
     The best gotchas have a PR or commit reference so future-you can re-derive the context.
     What belongs here:
       - "This looks broken but is load-bearing" patterns (`Don't 'fix' the retry logic in lib/inngest/transcode.ts — Modal cold starts return 503 and we don't want that paging`)
       - Framework-version surprises (`Next 15 changed fetch caching defaults`)
       - Library quirks (`Drizzle's .returning() is a no-op on MySQL — we're Postgres so it's fine`)
       - Schema invariants (`users.deleted_at — all queries must filter it; getUser() helper does it for you`)
       - "X doesn't work on Y runtime" (`Stripe webhook signature verification fails on Edge — pinned to nodejs`)
       - Local dev annoyances with fixes (`Inngest dev server eats port 8288; pkill -f inngest`)
     What does NOT belong here:
       - Bugs that are still bugs (those go in the issue tracker)
       - Generic best practices ("remember to handle errors")
     This section grows over time. Start with 0-3 entries and add as you hit them. -->
