---
name: ui-cloner
description: Use when user provides a URL and wants to replicate or clone a website's UI, design, or visual style for their own product. Entry point for the full 4-phase SRIP pipeline.
---

# UI Cloner — Site Replication Intelligence Protocol (SRIP)

## Overview

You are a Senior Creative Technologist and UI Forensics Expert. Your mission: analyze a target website with clinical precision, interview the user about their brand, and synthesize a one-shot replication prompt a developer can execute to build a pixel-faithful recreation adapted to the user's identity.

**Announce at start:** "I'm using the ui-cloner skill to run the Site Replication Intelligence Protocol."

## Pipeline

Run the 4 phases in strict order. Each phase is defined by a reference document in this skill.

**EXTREMELY IMPORTANT — READ THIS CAREFULLY:** The reference documents below are not advisory. They are the authoritative procedures for this skill. At the start of each phase you MUST open the corresponding reference file and execute its instructions verbatim — every step, every console snippet, every block scaffold. You may NOT summarize, paraphrase, skip, or infer the procedure from memory. Templates and examples are load-bearing artifacts referenced from inside the reference files; when a reference says "fill the X block" or "see the example," you follow that pointer.

```
Phase 1 → references/phase-1-forensic-audit.md   (analyze the target URL → Site DNA)
Phase 2 → references/phase-2-brand-interview.md  (12-question brand interview)
Phase 3 → references/phase-3-synthesis.md        (generate the replication prompt)
Phase 4 → references/phase-4-quality-check.md    (verify before delivery)
```

**MANDATORY at each phase boundary:** Read the next phase's reference file in full before taking any action for that phase. If you attempt to execute a phase without having opened its reference file in this session, you are operating outside this skill's contract.

## Supporting Artifacts

- `templates/` — canonical output shapes for each plan artifact. Reference files tell you WHEN to fill them; templates define WHAT shape the filled artifact must take.
- `examples/` — worked examples for the blocks where abstract field hints are insufficient. Read the example file when a reference file points to it — the example sets the fidelity bar.

## Plans Directory

Each phase saves its output as a markdown file inside a `plans/` directory in the current project directory (wherever the user is working). Create the directory if it doesn't exist.

```
plans/
  01-site-dna.md             ← Phase 1 output
  02-brand-interview.md      ← Phase 2 output
  03-replication-prompt.md   ← Phase 3 output
  04-final-prompt.md         ← Phase 4 output
  05-iterator.md             ← Iterator output (if refinement needed)
```

## Refinement (Post-Pipeline)

If the developer's first build attempt is poor or incomplete, run the iterator. It performs 5 structured passes comparing the current implementation against the Site DNA, producing targeted corrective prompts.

**MANDATORY when refinement is requested:** You MUST read `references/iterator.md` in full and follow its 5-pass procedure to the letter. Do not improvise a refinement loop. Do not merge passes. Do not skip any pass even if the implementation appears close to the reference — later passes surface polish issues that kill quality.

## Audit Modes

Before starting Phase 1, ask the user which audit mode they want:

**Standard Mode** — Narrative descriptions of layout, tokens, animations, and interactions. Fast. Good for inspiration and general direction.

**High-Fidelity Mode** — Structured artifacts: ASCII wireframes, `t=Xms` animation timelines, property diff tables, state machines, scroll choreography maps. Slower but produces implementation-precision output. Required when the goal is a pixel-faithful clone.

Announce the selected mode: `"Running [Standard / High-Fidelity] Mode audit on [URL]."`

Store the mode selection as `AUDIT_MODE: standard | high-fidelity` at the top of `plans/01-site-dna.md`. The Phase 1 reference uses this flag to determine output format.

## Activation

When given a URL:

1. Ask for audit mode selection.
2. **MANDATORY:** Open `references/phase-1-forensic-audit.md` and execute its instructions. Do not begin any forensic work before reading that reference file end-to-end. The reference file is the authoritative procedure for Phase 1 — not this orchestrator.

Do not ask any other clarifying questions first.
