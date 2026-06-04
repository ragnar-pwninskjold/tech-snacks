---
name: mine-claude-md
description: Mine recent Claude Code sessions for non-obvious, multi-file CLAUDE.md candidates, adversarially verify them, and propose paste-ready additions. Use when the user wants to harvest documentation-worthy patterns/gotchas from past coding sessions into a project's CLAUDE.md, or says "mine my sessions for CLAUDE.md", "what should be in my CLAUDE.md", "/mine-claude-md".
disable-model-invocation: true
allowed-tools: Workflow, Bash(echo *)
---

# mine-claude-md

Harvest **non-obvious** knowledge out of a project's recent Claude Code sessions and turn it
into proposed `CLAUDE.md` additions — without inventing anything. This runs a bundled
**dynamic workflow** that mines candidates in parallel, has independent skeptics adversarially
challenge each one (reject-by-default), loops until the well runs dry, and synthesizes the
survivors into a paste-ready report. It only *proposes* — it never edits your `CLAUDE.md`.

## Requirements (check first)

This skill drives Claude Code's **dynamic workflows** feature. Before running, confirm:

- Claude Code **v2.1.154+** and a **paid plan** (Pro/Max/Team/Enterprise) or API access.
- Workflows are **enabled** (`/config` → Dynamic workflows, or `disableWorkflows` not set,
  and `CLAUDE_CODE_DISABLE_WORKFLOWS` unset).

If workflows are disabled, the `Workflow` tool call below will fail. If it does, tell the user
to enable Dynamic workflows in `/config` and re-run — do **not** fall back to doing the mining
inline (the whole point is the parallel adversarial-verification harness).

## Resolve the bundled workflow path

The orchestration script ships inside this plugin. Resolve its absolute path now — this works
whether the plugin is installed at the personal, project, or plugin level, and regardless of the
current working directory:

```!
echo "${CLAUDE_SKILL_DIR}/../../workflows/mine-claude-md-from-sessions.workflow.js"
```

Use the path printed above as the `scriptPath` argument. Do not retype or guess it.

## Gather inputs

Determine the workflow `args` before launching:

- **`projectPath`** (required): the absolute path to the repo to mine. Default to the current
  project root (`${CLAUDE_PROJECT_DIR}` or the cwd) unless the user named a different repo.
- **`sessionCount`** (optional, default 20): how many recent sessions to read.
- **`maxRounds`** (optional, default 6): safety cap on mining rounds.
- **`dryRounds`** (optional, default 2): consecutive empty rounds that mean "done".
- **`miners`** (optional): miners per round; auto-scales 2–4 from session count if omitted.

If `projectPath` is ambiguous, ask the user once. Otherwise proceed with the current project.

## Run it

Call the **`Workflow`** tool with:

- `scriptPath`: the absolute path resolved above.
- `args`: an object, e.g. `{ "projectPath": "/abs/path/to/repo", "sessionCount": 20 }`.

The run executes in the background across these phases:

1. **Discover** — resolve the session store, build one merged, deduped digest of recent sessions
   (CLAUDE.md included once so nothing re-reads it).
2. **Mine** — parallel miners propose non-obvious, multi-file, non-structural candidates.
3. **Verify** — one combined-lens skeptic per candidate adversarially tries to break it; survives
   only if it withstands both the structure lens and the novelty/truth lens.
4. **Synthesize** — assemble survivors into a report with a paste-ready "Suggested CLAUDE.md
   additions" block.

Watch progress with `/workflows`. When it finishes, present the report to the user. Do **not**
modify `CLAUDE.md` yourself unless the user explicitly asks you to apply the additions.

## What counts as a good candidate

A pattern qualifies only if it is **non-obvious** (a competent engineer wouldn't guess it from
one read), **multi-file** (needs correlating 2+ locations), **not inferable from structure**
(not from the dir tree, file names, framework conventions, or imports), and **not already
documented** in the current `CLAUDE.md`. Quality over quantity — zero candidates beats weak ones.
