---
name: react-refactor-tournament
description: Review React/Next.js code against the real vercel-react-best-practices skill, backlog the performance findings keyed to actual rule ids + impact tiers, rank the most over-subscribed tiers, then fix + test the top N in isolated worktrees. Use when the user wants to systematically harvest and fix React/Next.js PERFORMANCE refactors (waterfalls, bundle size, RSC fetching, re-renders, JS perf), or says "react refactor tournament", "find React performance refactors", "/react-refactor-tournament".
disable-model-invocation: true
allowed-tools: Workflow, Bash(echo *)
---

# react-refactor-tournament

Harvest React/Next.js **performance** refactor candidates straight from the
`vercel-react-best-practices` skill, persist them as a tracked backlog keyed to the skill's real
rule ids and impact tiers, rank the most contested tiers, then auto-fix the worst N (each in an
isolated git worktree, with tests, committed but not pushed). This runs a bundled **dynamic
workflow** that fans out skill-backed reviewers in parallel, then ranks and fixes under a hard
500k-output-token cap.

It **only proposes and fixes on isolated worktree branches** — it never pushes or merges, and it
refuses to run at all if the `vercel-react-best-practices` skill isn't installed (no hand-written
stand-in).

## Requirements (check first)

This skill drives Claude Code's **dynamic workflows** feature. Before running, confirm:

- Claude Code **v2.1.154+** and a **paid plan** (Pro/Max/Team/Enterprise) or API access.
- Workflows are **enabled** (`/config` → Dynamic workflows, or `disableWorkflows` not set,
  and `CLAUDE_CODE_DISABLE_WORKFLOWS` unset).
- The **`vercel-react-best-practices` skill is installed** (project or user scope, `.claude/skills`
  or `.agents/skills`). The workflow's first phase hard-checks this and aborts with an actionable
  message if it's missing — do not try to work around it.

If workflows are disabled, the `Workflow` tool call below will fail. If it does, tell the user to
enable Dynamic workflows in `/config` and re-run — do **not** fall back to doing the review inline
(the whole point is the parallel skill-backed harness + token cap).

## Resolve the bundled workflow path

The orchestration script ships inside this plugin. Resolve its absolute path now — this works
whether the plugin is installed at the personal, project, or plugin level, and regardless of the
current working directory:

```!
echo "${CLAUDE_SKILL_DIR}/../../workflows/react-refactor-tournament.workflow.js"
```

Use the path printed above as the `scriptPath` argument. Do not retype or guess it.

## Gather inputs

Determine the workflow `args` before launching:

- **`repoPath`** (optional): absolute path to the repo root to review. Default to the current
  project root (`${CLAUDE_PROJECT_DIR}` or the cwd) unless the user named a different repo.
- **`n`** (optional, default 3): how many top-ranked candidates the fix loop processes.
  `n=0` ranks only and skips the fix loop entirely.
- **`scope`** (optional): a glob/dir hint to constrain the review (e.g. `src/components/dashboard`).
  Omit to auto-detect the React component areas.

If `repoPath` is ambiguous, ask the user once. Otherwise proceed with the current project.

## Run it

Call the **`Workflow`** tool with:

- `scriptPath`: the absolute path resolved above.
- `args`: an object, e.g. `{ "n": 3 }`, `{ "n": 0 }` for rank-only, or
  `{ "n": 3, "scope": "src/components", "repoPath": "/abs/path/to/repo" }`.

The run executes in the background across these phases:

1. **Preflight** — resolve the `vercel-react-best-practices` skill install path; abort if missing.
2. **Scope** — detect the framework and group React component dirs into disjoint review areas.
3. **Discover** — parallel reviewers invoke the skill and emit candidates keyed to real rule ids
   (`async-parallel`, `bundle-barrel-imports`, …), with `severity` = the rule's `impact:` tier.
4. **Backlog** — dedup, assign stable ids, and write `.pro-brown/refactors/BACKLOG.{json,md}`.
5. **Rank** — order by impact tier (free); a single lazy tie-break ranker re-orders only an
   over-subscribed tier (more candidates than remaining fix slots).
6. **Fix** (skipped when `n=0`) — fix the top N in isolated worktrees, write tests where feasible,
   and commit each (no push, no merge).

Watch progress with `/workflows`. When it finishes, present the ranking + backlog paths to the
user. Fixes live on isolated worktree branches — point the user at `git worktree list` /
`git branch` to review, and let them merge/PR. Do **not** push or merge on their behalf.

## What counts as a good candidate

A candidate qualifies only if it is a genuine violation of a **specific** `vercel-react-best-practices`
rule, pinned to a real `file:line`, with `ruleId` taken from the skill (never invented) and
`severity` taken from that rule's static `impact:`. Generic React hygiene the skill doesn't cover
(naming, alt text, design-system nits) does **not** qualify. Quality over quantity — a clean
codebase reporting zero candidates is a valid result.
