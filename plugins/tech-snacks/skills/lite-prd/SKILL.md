---
name: lite-prd
description: Use when the user hands you a vague or half-formed feature ask and wants it turned into a lightweight PRD, or asks to "write a PRD", "spec this feature", "flesh this out", or invokes /lite-prd. Interviews the user by traversing a design tree of clarifying questions, persists every Q&A round to the repo, and emits a lite-prd.md.
---

# lite-prd

Turn a vague feature ask into a lightweight PRD by interviewing the user with `AskUserQuestion`, traversing the design tree (branch deeper when an answer opens new territory), persisting every round, and writing `lite-prd.md`.

## What this does

1. Reads the vague ask and picks a slug + output folder.
2. Interviews the user in adaptive batches via `AskUserQuestion` (2–4 grouped questions per round), up to ~50 questions total.
3. **Traverses the design tree** — when an answer materially changes scope or leaves a real ambiguity, branch deeper into that thread before moving on.
4. Persists every question and answer to a Q&A log in the repo as it goes.
5. Synthesizes the answers into `lite-prd.md` in the pasted format (minus Monetization).

## Flags

- `--deep`: exhaustive branching — pursue every plausible sub-thread until the tree is dry or the ~50-question budget is spent. Default (no flag) is model-judged, biased to fewer: only branch when an answer materially changes scope or leaves a real ambiguity, and prefer finishing over exhausting the budget.

## Step 1 — Set up the workspace

- Derive a short kebab-case `<slug>` from the feature ask (e.g. "team invites" → `team-invites`).
- Create the folder `docs/lite-prd/<slug>/` in the repo the skill was invoked in. If it already exists, reuse it and continue an in-progress run rather than clobbering.
- Create/open the Q&A log at `docs/lite-prd/<slug>/qa-log.md`. Seed it with the raw ask.

## Step 2 — Interview by traversing the design tree

Read `references/traversal-protocol.md` and follow it exactly. It defines: how to seed the root questions, how to batch with `AskUserQuestion`, when to branch deeper vs. move on (and how `--deep` changes that), the ~50-question budget, and the persistence rule (write each round to `qa-log.md` immediately after the user answers, before asking the next batch).

Every round: ask → read answers → append the round to `qa-log.md` → decide whether to branch or advance.

## Step 3 — Synthesize the PRD

When the tree is covered (or the budget is spent), read `references/prd-template.md` and fill every section from the Q&A log. Write the result to `docs/lite-prd/<slug>/lite-prd.md`.

Rules:
- Use ONLY what the user actually told you plus low-risk, clearly-labeled inferences. Never invent requirements the interview didn't support.
- Requirements go in as user stories with `- [ ]` checkboxes, exactly as the template shows.
- Omit the **Monetization** section entirely (per the format).
- Anything still genuinely unresolved goes under **Critical Questions or Clarifications** — do not paper over gaps.

## Step 4 — Report

Tell the user the two paths written (`qa-log.md` and `lite-prd.md`), the question count, and list anything parked under Critical Questions so they know what's still open.

## Honesty rule

If the user's answers leave a section unsupported, write "TBD — see Critical Questions" rather than fabricating plausible-sounding content. A confidently-wrong PRD is worse than an honestly-incomplete one.
