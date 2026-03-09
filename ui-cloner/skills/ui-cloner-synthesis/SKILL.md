---
name: ui-cloner-synthesis
description: Use when Site DNA and all 12 brand interview answers are in hand and it's time to generate the final replication prompt. Phase 3 of SRIP — applies 11 synthesis rules to produce a one-shot developer build prompt.
---

# UI Cloner — Phase 3: Synthesis

## Overview

With the Site DNA and all 12 user answers in hand, generate the final replication prompt. Apply all rules below without exception.

**Announce:** "Phase 2 complete. Generating your custom replication prompt."

**Read `AUDIT_MODE`** from the top of `plans/01-site-dna.md` before generating. High-Fidelity mode requires applying the EMBED principle (Rule 2). Standard mode uses pseudocode-level descriptions (Rules 4–5).

**CRITICAL OPERATING PRINCIPLE — "EMBED, DON'T REWRITE" (High-Fidelity mode only)**
Your job is to transplant structured artifacts from the Site DNA DIRECTLY into the output prompt — with only brand variables substituted. This preserves fidelity. Every time you abstract or summarize instead of embedding precisely, fidelity is permanently lost.

The output is a complete, self-contained prompt a developer can paste directly into Claude or any code generation tool to build the site.

---

## Rule 1 — Output Structure

The final prompt must follow this exact hierarchy:
1. Role + Aesthetic Identity
2. Core Design System (adapted tokens)
3. Component Architecture (section-by-section, with embedded or spec'd blueprints)
4. Technical Requirements
5. Execution Directive

## Rule 2 — Embed the Artifacts (High-Fidelity Mode Only)

For every section and component, the output prompt MUST CONTAIN the actual structured artifacts from the Site DNA — not prose summaries of them:

- The ASCII wireframe from Step 1.3 (with user's content replacing reference content)
- The animation timeline with `t=Xms` notation from Step 1.4 (color/copy references updated to user's tokens)
- The state machine from Step 1.6 (preserved verbatim, update color values only)
- The property diff table from Step 1.5 (preserved verbatim, update hex values to user's palette)

Do NOT convert these into prose descriptions. Embed the actual structured artifact.

In Standard mode, skip this rule and proceed with pseudocode-level descriptions per Rules 4–5.

## Rule 2b — Anti-Flattening: Preserve Visual Compositions

**Flattening is banned.** When the Site DNA contains a Composition Map (from Step 1.3b), the output prompt MUST reproduce that composition with the user's content substituted. Specifically:

- The spatial arrangement (fanned, grid, radial) must be preserved
- The element count must be preserved (5 cards behind phone → 5 cards behind phone)
- Per-element visual treatments (blur, opacity, rotation angles) must be preserved with exact values
- If the user's brand interview says "KEEP AS-IS" for that section, embed the composition verbatim
- If "ADAPT," describe how each element adapts (e.g., "5 fanned Cheggout app screenshots become 5 fanned DawgTalk feature screenshots")

This rule applies beyond compositions — it applies to EVERY detail in the Site DNA:
- Colors: every hex code, every role mapping, every gradient stop
- Typography: every weight, every size, every line-height, every font-family
- Layouts: every column width, every gap value, every padding value
- Animations: every timing value, every easing curve, every stagger delay
- Interactions: every state, every transition property, every duration

If the Site DNA specifies it, the output prompt must contain it. Details do not get summarized, paraphrased, or omitted. They get transplanted exactly or explicitly adapted with the new values stated.

## Rule 3 — Adopt the Creative Technologist Voice

Open with:
> **Role:** Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer.

Then define an **Aesthetic Identity** — a 5–8 word poetic description of the site's soul (e.g., "Clinical Boutique / High-End Organic Tech"). Derive this from the user's 3 adjectives + the reference site's motion philosophy.

## Rule 4 — Build the Design System Section

Create a named, structured design system:

- **Palette:** Each color gets a semantic NAME (Primary, Accent, Background, etc.) + a descriptive word (e.g., "Moss", "Clay", "Cream") + exact hex code
- **Typography:** Each font gets a named role (Headings, Drama/Emphasis, Data/Monospace) with specific usage rules and special instructions (e.g., "Must use Italic for emotional/philosophical concepts"). Explicitly preserve the ⚑ DRAMA NOTE typographic contrast ratio from Step 1.2.
- **Texture System:** Specify noise/grain approach, border-radius scale, shadow system

## Rule 5 — Name Every Component as an Artifact

Every interactive or animated component MUST receive a poetic conceptual name in parentheses encoding its behavior.

Formula: **[Evocative Adjective/Noun] + [Functional Description]**

Examples:
- Morphing sticky nav → "The Floating Island"
- Stacked scroll cards → "The Sticky Stacking Archive"
- Typewriter feed → "The Telemetry Typewriter"
- Cursor demo → "The Mock Cursor Protocol Scheduler"

The name must make a developer immediately understand the vibe AND the behavior.

## Rule 6 — Write Pseudocode-Level Interaction Specs (Standard Mode)

In Standard mode, for every animated component write behavior at implementation-level clarity.

Not: "cards animate in"

But: "3 overlapping white cards that cycle vertically using unshift(pop()) logic. Every 3 seconds, they rotate with a spring-bounce transition using cubic-bezier(0.34, 1.56, 0.64, 1)."

Include:
- Exact timing values (duration ms, delay offsets)
- Exact cubic-bezier or named easing values
- State logic (what triggers, what resets)
- JS pattern names (unshift/pop, requestAnimationFrame, IntersectionObserver)
- CSS property targets (transform: scale(), filter: blur(), opacity)

In High-Fidelity mode, Rule 2's embedded artifacts replace this rule — the t=Xms timelines already contain this precision.

## Rule 7 — Color Substitution (Not Reassignment)

Map the reference site's color ROLES to the user's palette:
- Reference Primary → User Primary (maintain all the same usage contexts)
- Reference Accent → User Accent
- Reference Background → User Background
- Reference Dark → User Dark/Charcoal

Never randomly reassign colors. Maintain the STRUCTURAL role each color plays. Update hex values inside embedded artifacts accordingly. Never change WHICH element uses WHICH role.

## Rule 8 — Adapt Copy Voice

Apply the reference site's rhetorical structure (from Step 1.9 COPY VOICE PATTERN) to the user's content.

- If reference used contrast framing ("Modern medicine asks X / We ask Y") → replicate that STRUCTURE with user's content
- If reference used fragments → use fragments
- If reference used aspirational framing → apply to user's differentiator

Preserve the voice pattern, replace the substance.

## Rule 9 — Adapt Animation Intensity

| User Selection | Action |
|---|---|
| 1–2 | In embedded timelines (HF) or descriptions (Standard): replace GSAP calls with CSS transition equivalents. Remove scroll-triggered parallax. Keep entrance animations on load only. |
| 3 | Preserve GSAP for hero section and 1–2 key components. Simplify scroll triggers to basic fade-in-up only. |
| 4–5 | Embed all timelines and state machines verbatim from Site DNA. Add or enhance with any additional interactions the user requested. |

## Rule 10 — Technical Requirements Section

End the component architecture with an explicit technical requirements block:

```
TECHNICAL REQUIREMENTS
  Stack:                [exact user-specified stack — framework, language, component library]
  Animation:            [library + version if known, e.g., GSAP 3.12]
  Scroll:               [scroll library if needed, e.g., GSAP ScrollTrigger / Lenis]
  Animation Lifecycle:  [e.g., "Use gsap.context() scoped to component ref inside useEffect; return context.revert() on cleanup"]
  Scroll Trigger Setup: [e.g., "Register ScrollTrigger plugin. Use trigger:'[selector]', start:'top 80%', end:'top 20%', scrub:true for parallax"]
  Hover Implementation: [e.g., "All buttons: overflow-hidden with ::before pseudo-element, translateX(-100%)→translateX(0) on hover, 300ms ease-out"]
  Custom Cursor:        [if applicable — cursor behavior and implementation]
  Font Loading:         [e.g., "Load via Google Fonts: Plus Jakarta Sans 400,700,800 + Cormorant Garamond 300,300italic"]
  Image Sources:        [real Unsplash URLs matching aesthetic specified by user, or user-provided asset references — no placeholders]
```

## Rule 11 — Execution Directive

The very last line of the prompt MUST be an italicized or quoted philosophical directive — a single sentence capturing the SOUL of the build.

It should not describe what to build, but HOW to feel while building it.

Examples:
- *"Do not build a website; build a digital instrument."*
- *"Every scroll should feel like turning a page in a rare book."*
- *"This is not a product page; it is a declaration of a new category."*

---

## After Generating

**Save output:** Write the full generated replication prompt to `plans/03-replication-prompt.md` in the current project directory.

**When complete:** Invoke **ui-cloner-quality-check** to run Phase 4 before delivery.
