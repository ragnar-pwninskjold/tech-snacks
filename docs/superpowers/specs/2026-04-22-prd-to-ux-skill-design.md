# prd-to-ux Skill — Design Spec

**Date:** 2026-04-22
**Status:** Approved — ready for implementation plan

## Purpose

A Claude Code plugin skill that takes a PRD (or raw product idea) and produces **tool-agnostic, concept-driven screen prompts** optimized for web-based UX generators — Google Stitch, Figma AI, Pencil.dev, Claude Design, and similar tools.

The skill describes *design intent* (what a screen is for, what's visible, how it feels), not build specs (no Tailwind, no component trees, no hex codes unless the user provides them). This lets the rendering tool bring its own interpretation rather than mechanically executing a pixel-level spec.

## Problem Being Solved

The user currently runs a manual 4-prompt pipeline to go from PRD → screen mockups. Each prompt is pasted separately, context is reconstructed each time, and the outputs are built for code-generation rather than design-tool prompting. The skill codifies the pipeline, automates handoffs between steps, and pivots the final output away from code-oriented specs toward concept descriptions suited to modern web UX generators.

## Pipeline Shape

Four steps. Steps 1 and 3 are optional. Steps 2 and 4 are required.

1. **PRD Shaping** *(optional)* — consultative dialogue that turns an idea + MVP sketch into a PRD with features and UX considerations. Skipped if the user already has a PRD.
2. **Feature & State Briefs** *(required)* — enumerates screens and states for every feature.
3. **Design Direction** *(optional)* — lightweight mood/personality brief. Defaults to a shadcn-style neutral hi-fi aesthetic when skipped.
4. **Screen Prompts Export** *(required)* — concept-driven prompts, one per screen-state, pasteable into any web UX tool.

Validation gate sits between step 1 and step 2: the PRD must describe concrete features, user flows, and target platform(s) before the skill proceeds.

## File Layout

Skill lives at `skills/prd-to-ux/` alongside the existing `ui-cloner`.

```
skills/prd-to-ux/
├── SKILL.md                          # Orchestrator — short, flow-focused
├── references/
│   ├── step-1-prd-shaping.md
│   ├── step-2-feature-states.md
│   ├── step-3-design-direction.md
│   ├── step-4-screen-prompts.md
│   ├── prd-validation.md
│   └── default-design-direction.md
└── templates/
    ├── prd.template.md
    ├── features-and-states.template.md
    ├── design-direction.template.md
    └── screen-prompt.template.md
```

`SKILL.md` stays short and orchestrates the pipeline. Each step's "how to think" lives in its own reference file. Templates are the concrete scaffolds the skill fills in.

**SKILL.md frontmatter:**

```yaml
---
name: prd-to-ux
description: Use when translating PRDs, feature specs, or product requirements into concept-driven screen prompts for web UX tools like Google Stitch, Figma AI, Pencil.dev, or Claude Design. Produces tool-agnostic prompts that describe design intent rather than code.
---
```

## Step-by-Step Behavior

### Step 1 — PRD Shaping (optional)

Triggered when the user does not have a PRD. Runs a consultative dialogue adapted from the user's existing prompt-1: one clarifying question at a time on problem, target user, core features, MVP scope. Each response integrates into the growing PRD and the full document is reflected back to the user.

Output file: `01-prd.md`. Conforms to the PRD template (elevator pitch, problem statement, target audience, USP, target platforms, features list with UX considerations, non-functional requirements, monetization, critical questions).

If the user already has a PRD, they provide a file path or paste the content. The skill writes it to `01-prd.md` verbatim and moves to validation.

### Gate — PRD Validation

Before step 2, the PRD is checked for:
- A concrete features list (not vague capability statements)
- User flows or user stories describing what the user does
- Target platform(s) — mobile, web, desktop

If any are missing, the skill tells the user exactly what is absent and offers to run step 1 to fill the gaps. It does not proceed until the gate passes.

### Step 2 — Feature & State Briefs (required)

For each feature in the PRD, the skill produces a brief covering:
- User stories (persona + goal + motivation)
- Screens the feature spans
- States per screen — empty, loading, populated, error, permission-denied, and edge cases (long content, offline, auth-gated, etc.)
- Interaction notes — progressive disclosure, key affordances, what changes between states

No visual or stylistic decisions are made at this step. Purely functional and behavioral.

If a feature lacks enough detail to enumerate states, the skill stops on that feature, asks targeted clarifying questions, updates the PRD, and continues. States are never fabricated.

If the PRD has more than 8 features, the skill flags this and asks whether to process all or a user-selected subset first. The skill also supports scoping to a single feature for iterative work — at step 2 opening it asks "all features or a specific one?"

Output file: `02-features-and-states.md`, written incrementally feature-by-feature.

### Step 3 — Design Direction (optional)

The skill asks whether the user wants to specify a design direction or use the default.

If the user provides direction, it captures:
- Mood and personality
- Tone (e.g., calm, playful, editorial, utilitarian)
- Inspirations — apps or sites the user likes
- Key principles
- Must-have affordances

No hex codes, no dp values, no prescriptive component specs. This is vibe, not spec.

If the user skips, the skill loads `default-design-direction.md` — a shadcn-style neutral palette (black, white, grays), modern sans-serif, generous whitespace, subtle shadows, clean component feel. The default is not written to disk; it is referenced inline during step 4.

Output file (when user provides direction): `03-design-direction.md`.

### Step 4 — Screen Prompts Export (required)

This is the core pivot. For each screen × state from step 2, the skill generates a self-contained prompt the user can paste into Stitch, Figma AI, Pencil.dev, Claude Design, or similar.

Each prompt describes:
- What the screen is for — the user's goal in one sentence
- What's visible — content, hierarchy, key elements, described in natural language
- What the user can do here — primary action, secondary actions
- The feel — pulled from the design direction, or the shadcn default
- State context — e.g., "this is the empty state, no notes yet"
- Any critical affordances — e.g., "the capture input should feel like a fresh page, not a form field"

Explicitly omitted: Tailwind classes, component trees, file paths, lucide imports, exact measurements, color hex codes (unless the user's design direction supplied them).

Output: one markdown file per feature at `04-screen-prompts/<feature-slug>.md`, with each state as a labeled subsection containing a copy-pasteable prompt block. Grouped feature → screen → state so users can grab just the prompt they need.

## Artifacts & Persistence

All artifacts are written to `docs/prd-to-ux/<YYYY-MM-DD>-<project-slug>/` in the user's current working directory:

```
docs/prd-to-ux/2026-04-22-reflections-app/
├── 01-prd.md
├── 02-features-and-states.md
├── 03-design-direction.md        (only if user provided custom direction)
└── 04-screen-prompts/
    ├── capture.md
    ├── reflections.md
    ├── archive.md
    └── settings.md
```

The project slug is derived from the PRD's title or elevator pitch (lowercase kebab-case). The skill proposes the slug and lets the user override.

## User Experience & Flow Control

**Entry:** User invokes via `/prd-to-ux` or references the skill, optionally passing a PRD path or pasted content.

**Opening move:** The skill introduces the 4 steps briefly, then asks: *"Do you have a PRD, or should we build one from an idea?"* This single question determines whether step 1 runs.

**Resumability:** Before starting, the skill checks for an existing `docs/prd-to-ux/<date>-<project>/` directory. If found, it asks whether to resume at the next missing step or start fresh. Each step writes incrementally so a dropped session does not lose work.

**Between steps:** After each artifact is written, the skill shows a terse summary (what was produced, where it lives) and asks to proceed or refine. Refinement edits the artifact in place before moving on.

**Final handoff:** After step 4, the skill summarizes:
- Directory path
- Count of features, screens, and states produced
- Quick-start: "Open `04-screen-prompts/<feature>.md`, copy the prompt block for the state you want, and paste into Stitch / Figma AI / Pencil / Claude Design."

**Termination:** The skill stops at step 4. It does not invoke any rendering tool itself. The user takes the prompts elsewhere.

## Edge Cases

- **Large PRDs:** >8 features triggers a scope-narrowing prompt before running step 2.
- **Vague feature description:** Skill pauses, asks targeted questions, updates PRD, resumes. Never fabricates states.
- **Mid-flow PRD paste:** Accepted — written to `01-prd.md`, validated, proceeds.
- **Partial artifacts on resume:** Skill confirms existing artifacts are still current, then resumes at the next missing step.
- **Single-feature scope:** Supported at step 2 opening for iterative work.
- **Non-feature PRD content** (business model, technical architecture): Ignored by step 2; noted but not processed.
- **Design-direction vs. functional tension** (e.g., "minimal" direction + dense data table): Surfaced in the screen prompt as a note to the rendering tool, not silently resolved.
- **Platform mismatch** (mobile PRD + web-focused rendering tool): Noted in final handoff with a suggestion to specify platform framing when pasting.

## Out of Scope

- Invoking rendering tools on the user's behalf
- Generating code (React, Tailwind, component files) — this is what the pivot explicitly moved away from
- Pixel-level style specs (hex codes, dp values, spring tensions) — unless the user opts in via step 3
- Iteration on rendered output — that belongs to the rendering tool, not this skill
- Maintaining a design system across projects — each project run is self-contained

## Dependencies

- Must conform to the existing plugin structure (`skills/<name>/SKILL.md` with frontmatter, kebab-case name matching directory)
- README should be updated to list `prd-to-ux` alongside `ui-cloner`

## Success Criteria

- User can run the skill end-to-end starting from either an idea or an existing PRD
- Final prompts are self-contained — pasting one into Stitch/Figma AI/Pencil/Claude Design produces a meaningful mockup without additional context
- No generated prompt contains Tailwind classes, component code, or prescriptive hex values (unless user's design direction supplied them)
- A dropped session can be resumed without losing prior work
- The existing 4-prompt workflow in `temp/` can be retired once this skill is in use
