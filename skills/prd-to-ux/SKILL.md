---
name: prd-to-ux
description: Use when translating a PRD, feature spec, or raw product idea into screen-level prompts for web UX generators (Google Stitch, Figma AI, Pencil.dev, Claude Design, v0, or similar). Use before creating visual mockups or wireframes.
---

# prd-to-ux

Take a PRD (or a raw product idea) and produce **tool-agnostic, concept-driven screen prompts** for web UX generators — Stitch, Figma AI, Pencil, Claude Design, and similar.

Output describes design *intent*: what a screen is for, what's visible, how it feels. It does NOT emit Tailwind, component trees, or hex codes (unless the user explicitly supplies them).

## Pipeline

- **Step 1 — PRD Shaping** *(optional)* — when no PRD exists. See `references/step-1-prd-shaping.md`.
- **Gate — PRD Validation** — required pass between Step 1 and Step 1.5. See `references/prd-validation.md`.
- **Step 1.5 — UX Philosophy** *(required)* — 3 distinct philosophies, user picks. See `references/step-1-5-ux-philosophy.md`.
- **Step 2 — Feature & State Briefs** *(required)* — screens and states per feature. See `references/step-2-feature-states.md`.
- **Step 3 — Design Direction** *(optional)* — vibe brief, or shadcn-style default. See `references/step-3-design-direction.md` and `references/default-design-direction.md`.
- **Step 4 — Screen Prompts Export** *(required)* — one prompt block per screen × state. See `references/step-4-screen-prompts.md`.

The divergent→convergent pattern shared by Step 1 (features) and Step 1.5 (UX expressions) lives in `references/divergent-convergent-pattern.md`.

## Artifacts

Written to the user's current working directory under:

```
docs/prd-to-ux/<YYYY-MM-DD>-<project-slug>/
├── 01-prd.md
├── 01b-ux-philosophy.md
├── 02-features-and-states.md
├── 03-design-direction.md        (only if user opted in at Step 3)
└── 04-screen-prompts/
    ├── <feature-1>.md
    └── ...
```

Project slug is lowercase kebab-case derived from the PRD title or elevator pitch. Skill proposes a slug and lets the user override.

## Entry

User invokes `/prd-to-ux` or references the skill, optionally passing a PRD file path or pasted content.

## Opening Move

1. Introduce the pipeline stages briefly (Step 1 through Step 4, plus the validation gate).
2. Ask: **"Do you have a PRD, or should we build one from an idea?"**
3. Check the target directory `docs/prd-to-ux/<today>-<proposed-slug>/` for existing artifacts.
   - **Directory exists with artifacts:** ask whether to resume at the next missing step or start fresh.
   - **Directory does not exist:** propose the slug, confirm, then create it and proceed.

## Flow Control

- **One step runs at a time.** Between steps, show a terse summary (what was produced, where it lives) and ask to proceed or refine. Refinement edits the artifact in place before moving on. This is the phase gate — do not batch steps.
- **Artifacts are written incrementally** within each step. A dropped session can be resumed on restart.
- **Skill never auto-selects** at any convergence point. User chooses the philosophy, the design direction, the feature scope. See the individual step references for specifics.

## Termination

The skill stops after Step 4 (Screen Prompts Export). It does NOT invoke Stitch, Figma AI, Pencil, Claude Design, or any other rendering tool. The user takes the prompts elsewhere.

## Edge Cases

- **Vague feature at Step 2:** pause, ask targeted questions, update `01-prd.md`, resume. Never fabricate.
- **User pastes a PRD mid-flow:** write verbatim to `01-prd.md`, run validation gate, skip divergent-adversarial at Step 1, proceed to Step 1.5.
- **User rejects all 3 philosophies at Step 1.5:** re-diverge with different constraints, or take user-supplied axes. Do not force a choice.
- **Design-direction vs. functional tension** (e.g., "minimal" + dense data table): surface in the relevant screen prompt as a note to the rendering tool, don't silently resolve.
- **Platform mismatch** (mobile PRD, user plans to paste into a web-focused tool): note in final handoff; suggest specifying platform framing when pasting.

## Out of Scope

- Invoking rendering tools on the user's behalf.
- Generating code (React, Tailwind, component files).
- Pixel-level style specs (hex, dp, spring tensions) — unless the user supplied them in Step 3.
- HTML preview artifacts, consultant-posture mockup proposals.
- Iteration on rendered output (belongs to the rendering tool).
- Maintaining a cross-project design system.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "Skip the philosophy step, the user knows what they want" | Step 1.5 is required. The 3-philosophy frame is where expression-level coherence is decided. |
| "Auto-pick the recommended philosophy — user seems decisive" | Never auto-select. Always wait for the user's choice. |
| "Skip empty/error states to move faster" | No. Every state gets a prompt. |
| "Add Tailwind classes to make prompts more actionable" | The skill is explicitly tool-agnostic. Describe, don't prescribe. |
| "Batch multiple steps in one message to save turns" | Phase gates exist to catch drift early. Run one step at a time. |
