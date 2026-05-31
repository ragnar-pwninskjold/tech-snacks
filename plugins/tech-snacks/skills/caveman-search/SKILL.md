---
name: caveman-search
description: Use when the user wants a terse, opinionated, research-backed answer to a "what tech/tools/stack do I need for X" question, or asks how to approach building something. Triggers on "caveman search", "caveman research", "/caveman-search", and on tooling/architecture questions where the user wants the direct answer, not a survey. Runs decomposed research (local repo + live web), verifies, and renders in a compressed caveman voice that leads with the load-bearing truth.
---

# caveman-search

Research-backed answers in compressed caveman voice. Decompose research like Compound Engineering; render like Matt Pocock; always lead with the big truth.

## What this does

1. Detects whether the question needs LOCAL repo research, EXTERNAL web research, or BOTH.
2. Runs a local-first escalation gate — skips web research when the repo already answers it.
3. Fans out to parallel research agents.
4. Optionally runs an adversarial verify pass (`--verify`).
5. Renders the result in caveman voice, big-truth-first.

## Flags

- `--verify` (or `--deep`): run the adversarial verifier on each key recommendation.
- `--hard`: maximum voice compression (see voice spec).
- No flags: light-medium voice, no verifier.

## Step 1 — Detect mode

Inspect the question and current context:
- Mentions "this/here/our code", repo file names, or "add X here" -> **repo mode**.
- Names external tech, asks "what should I use", greenfield, or "if I wanted to build" -> **web mode**.
- Both signals, or genuinely ambiguous -> **both**.
- Pure general-topic with no repo angle -> **web only** (do not waste a repo scan).

Also read the **audience tier** from the question. DEFAULT to `builder` and bias toward `simple` — recommend the simplest tool that clears the bar, not the most rigorous one. Escalate to `expert` ONLY on explicit signals: "ML team", "production-grade", "at scale", "I already use X", named low-level libraries, researcher-depth framing. Signals like "assume X is solved, I just care about Y" or "I want to ship" mean: stay simple, give one clear path. Pass the tier to the web researcher in Step 3.

## Step 2 — Escalation gate (local-first)

If repo mode ran:
- Spawn `caveman-repo-scout` first (or as part of the parallel fan-out) and read its `local_coverage`.
- If `local_coverage >= 3` AND the topic is NOT high-risk (auth, payments, data migration, external API integration) -> answer from local research, skip web.
- Otherwise escalate: also run web research.
- High-risk topics ALWAYS escalate to web, regardless of local_coverage.

## Step 3 — Parallel fan-out

Dispatch the selected agents in a SINGLE message so they run concurrently (Task tool, one call per agent):
- repo mode -> `tech-snacks:research:caveman-repo-scout`
- web mode -> `tech-snacks:research:caveman-web-researcher`
- both -> both, in parallel.

Pass each agent the topic (cleaned of flags). Pass the web researcher the audience tier from Step 1 so it surfaces the right depth of tools (simple/builder = batteries-included; expert = composable stacks ok).

## Step 4 — Verify pass (only if --verify)

Each `caveman-web-researcher` recommendation is already a self-contained claim. For each one, dispatch `tech-snacks:research:caveman-verifier` in parallel (one call per claim, single message). Reconcile:
- verdict `holds` -> keep, unmarked.
- verdict `weakened` -> keep with the verifier's correction folded in.
- verdict `wrong` -> drop it; if the verifier supplied a real answer, use that instead.

## Step 5 — Render

Read these two files and follow them exactly:
- `references/voice-spec.md` — the voice TRANSFORM (not a description — apply it). Big Truth First is mandatory.
- `references/output-format.md` — the section skeleton.

The digest you got from the researchers is verbose. Do NOT echo its register. **Transform** it through the voice spec — drop articles/filler/hedging, force fragments, lead with the Big Truth. Then run the voice spec's **pre-output check** before sending: if sentences read full and smooth like a report, you drifted — rewrite them. Keep the researcher's per-job 2-3-option structure; do not re-expand it into a buffet.

Apply the Auto-Clarity Exception from the voice spec for any security warning, irreversible action, or ordered sequence.

## Step 6 — Output

Emit the response per the output skeleton: big truth -> tools -> shape (if architectural) -> bottom line -> sources (if web mode). Annotate corrected claims inline if `--verify` ran.

## Honesty rule

If research found nothing solid, say so terse and name the closest option plus its gap. Never invent confident-sounding tool names — in this voice a wrong claim reads as authoritative, which is the worst failure mode.
