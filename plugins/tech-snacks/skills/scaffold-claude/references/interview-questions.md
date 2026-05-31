# Interview Questions

Question scripts for each section. Use these verbatim or close to it. The goal of every question is to surface **edge cases and non-obvious context** — facts that aren't already visible in the codebase.

## Universal rules for every question

1. **Ask. Do not infer.** Even if `package.json` shows `"react": "^19"`, do not write "React 19" in the Stack section until the user confirms it's a *meaningful* choice (vs. "yeah it's React, nothing interesting there").
2. **Offer "skip" every time.** "If there's nothing non-obvious here, say skip and I'll stub it."
3. **One section at a time.** Don't batch all questions. The user's attention is the bottleneck.
4. **Echo what they said before writing.** "OK so I'll write: '<paraphrase>'. Sound right?" — catches misinterpretation before it hardens into the file.
5. **Confirm overwrites.** If `CLAUDE.md` already exists, ask before reading or replacing.

---

## Header paragraph

> "One or two sentences: what is this project, what scale are you targeting, and what are you optimizing for (shipping speed, reliability, enterprise compliance, etc.)? If you'd rather skip, I'll leave a TODO."

**Do not** propose wording based on the README. Ask, then write what they say.

---

## Stack

> "I can see your package.json / Gemfile / go.mod. Rather than list every dependency, tell me: **which stack choices have a story?** Examples:
>   - A choice made *against* the obvious default (`pnpm only, never npm`)
>   - A version pinned for a specific reason (`Node 22 because bun broke X`)
>   - A library you migrated *off* of and don't want to go back to
>   - A managed service (Vercel / Neon / Modal / Resend / Supabase) and what it's responsible for
>
> List as many as you want. If none, say skip."

For each item the user gives, ask: **"What's the reason?"** A stack entry without a reason is noise.

---

## Commands

> "What commands do you actually run day-to-day? Don't list every npm script — just the ones an agent would need to know to be useful. For each one, is there a usage hint that isn't in the script itself? (e.g. `pnpm test path/to/file — always prefer this over the full suite when iterating`)
>
> If your README already documents this well, say skip and I'll point to the README instead."

---

## Architecture (only what isn't obvious)

> "This section is the most important and the easiest to get wrong. The rule: **only document what a smart new contributor would get wrong on their first PR.** I'm going to ask in a few different ways to surface things.
>
> 1. Is there a layering rule? (e.g. 'all DB access goes through `lib/db/queries/*.ts`, never `drizzle-orm` directly')
> 2. Is there a framework default you've flipped? (e.g. 'Server Components by default, `use client` only when X')
> 3. Is there a route or module that looks weird but is the way it is on purpose? (e.g. 'the Stripe webhook reads the raw body — don't refactor for consistency')
> 4. Is there a data flow that spans multiple services? (e.g. 'upload → Inngest → Modal → S3 → Inngest → DB → Resend')
> 5. Anywhere you've watched an LLM make the same wrong assumption twice?
>
> Skip any that don't apply. We can always add more later."

---

## Conventions

> "Coding patterns where the *rationale* matters as much as the rule. A few prompts:
>
>   - Type strictness rules (`no any`, error narrowing patterns)
>   - Export style (named vs default, where defaults are required)
>   - Error handling pattern (custom error class? plain throws? Result type?)
>   - Boundary validation (Zod / similar — where required, where not)
>   - Test policy (what must be tested, what's covered elsewhere)
>   - Commit message format (especially if a bot parses it — `release-please`, `semantic-release`, etc.)
>   - When *you* require plan mode for changes
>
> For each one you give me, I'll ask for the reason. If you don't have a reason, we'll leave it out — unreasoned conventions become cargo culting."

---

## Hard constraints

> "'Never X' rules. Each one needs a reason or an enforcement note (or both). Categories to think about:
>
>   - Things that corrupt state if violated (e.g. editing past migrations)
>   - Things that leak secrets (e.g. committing .env)
>   - Production safety (e.g. `db:push` against prod, `--force` push to main)
>   - Anti-patterns that look reasonable but break this specific app
>   - Files / directories that are off-limits without your sign-off (e.g. marketing pages under A/B test)
>
> For each rule, is it enforced anywhere — deny rule in `.claude/settings.json`, pre-commit hook, CI check? If so, tell me — agents trust enforced rules more.
>
> **If you don't have any hard constraints yet, skip this. An empty stub is better than invented rules.**"

---

## Pointers to deeper docs

> "Files you'd want Claude to read *when relevant*, but not auto-load every conversation. Examples:
>
>   - Architecture diagrams
>   - ADRs / decision logs
>   - AGENTS.md or other tool-neutral docs
>   - Auto-loaded subset rules (`.claude/rules/*.md` that load on path globs) — if you've actually set these up
>   - A `.claude/skills/` directory for procedures
>
> List paths you actually have. Don't make any up — I won't either."

---

## Gotchas

> "This is the bug-fix archaeology section. Tribal knowledge. Things that took someone 4 hours to figure out and would take the next person 4 hours again if it weren't written down.
>
> Prompts to jog memory:
>
>   - 'This looks broken but is load-bearing' — code that has a confusing shape because of a real bug
>   - Framework version surprises (caching default changed, breaking API change)
>   - Library quirks (silent no-ops, runtime incompatibilities)
>   - Schema invariants the codebase enforces in non-obvious places (soft-delete columns, denormalized counters)
>   - 'X doesn't work on Y runtime' (Edge vs Node, browser vs server)
>   - Local dev annoyances with fixes ('port 8288 stuck → `pkill -f foo`')
>
> Start with 0–3 entries. This section grows over time. If you can't think of any, that's a legitimate answer — leave it stubbed with a note to add as you hit them."

For each gotcha, ask: **"Is there a PR or commit I can reference?"** PR refs are gold — they let future-you re-derive the full context.

---

## Closing

> "I'll write the file now. Anything I asked about that you skipped will be left as a TODO comment, so you can fill it in later without losing the structure."

Then write the file. Show a diff or the final content. Do not add closing flourishes ("Now your project has a great CLAUDE.md!"). Just confirm the path and stop.
