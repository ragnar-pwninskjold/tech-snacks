# UI Cloner — Phase 4: Quality Self-Check

## Overview

Before delivering the final prompt, run through the full fidelity checklist below. If any item is missing, generate the missing content and insert it — do not deliver an incomplete prompt.

**Announce:** "Running Phase 4 — Quality Self-Check before delivery."

**Read `AUDIT_MODE`** from `plans/01-site-dna.md`. High-Fidelity mode must pass all 5 fidelity domains. Standard mode must pass the Core Checklist.

The output artifact shape (verified final prompt) lives in `../templates/final-prompt.template.md`.

---

## Core Checklist (Both Modes)

Verify the generated prompt contains ALL of the following:

- [ ] **Named aesthetic identity** — 5–8 word poetic description of the site's soul (derived from user's 3 adjectives + reference site's motion philosophy)
- [ ] **Complete design system** — named colors (semantic name + descriptive word + hex), typography roles with usage rules, texture/radius/shadow spec
- [ ] **Every section has a poetic component name** — using the [Evocative Adjective/Noun] + [Functional Description] formula
- [ ] **Every interactive component has implementation-level behavior spec** — state logic, triggers, resets, JS patterns, CSS property targets
- [ ] **At least one cubic-bezier or timing value per animated component** — no animation described without exact easing or duration
- [ ] **Color hierarchy preserved** — reference Primary/Accent/Background/Dark mapped to user's palette in structural roles (not randomly reassigned)
- [ ] **Technical requirements section explicitly specified** — stack, animation library, lifecycle management, hover implementation, font loading, image sources
- [ ] **Execution directive as the final line** — italicized or quoted philosophical sentence about HOW to feel while building (not what to build)

---

## High-Fidelity Fidelity Domains (HF Mode Only)

### LAYOUT FIDELITY
- [ ] ASCII wireframe present for EVERY section (not omitted, not replaced with prose)
- [ ] Internal component layouts documented with dimensions and positioning logic
- [ ] Grid/flex layout system specified per section — the EXACT column structure (not "use a grid")

### VISUAL COMPOSITION FIDELITY
- [ ] **Hero composition fully specified** — if the Site DNA shows a multi-element composition (Composition Map exists), the prompt must specify: element count, arrangement, per-element blur/opacity/rotation, and spatial relationship to centerpiece. A hero described as "phone mockup" when the DNA shows "phone + fanned cards" is a CRITICAL failure.
- [ ] **No flattened descriptions** — search the prompt for vague descriptions like "shows [device] with [app]", "animation plays", "cards appear", "warm palette". Each must be replaced with exact specifications. Every visual element must be individually described.
- [ ] **Opaque media decomposed** — any Lottie, SVG, or canvas element is described by its rendered visual output (what you see), not its DOM representation (one node)

### ANIMATION FIDELITY
- [ ] Every animated element has a timeline entry with `t=Xms` notation
- [ ] At least one `cubic-bezier()` or named easing value per animated component
- [ ] Scroll trigger positions specified — `start: top 80% viewport` format (not "when visible")
- [ ] Stateful components have full state machine notation

### INTERACTION FIDELITY
- [ ] Every interactive element has a DEFAULT → HOVER property diff table
- [ ] Special mechanisms (pseudo-element slides, clip-path reveals) are explicitly named
- [ ] Transition durations and easings specified per interaction

### DESIGN SYSTEM FIDELITY
- [ ] Complete palette with semantic names + hex codes
- [ ] Typography scale with all 5+ roles specified with exact values
- [ ] Typographic drama ratio from Step 1.2 ⚑ DRAMA NOTES explicitly preserved

### TECHNICAL FIDELITY
- [ ] Exact tech stack specified with library names and versions
- [ ] Animation lifecycle management specified (e.g., `gsap.context()` / cleanup)
- [ ] Font loading method specified
- [ ] Scroll trigger setup specified
- [ ] Execution directive present as final line

---

## Zero Generic Language Enforcement (Both Modes)

Scan the entire prompt for any instance of the following phrases. Each is a fidelity failure — replace with exact values:

| Generic phrase | Replace with |
|---|---|
| "some animation" | specific element + t=Xms timeline or duration |
| "nice hover effect" | exact property diff: DEFAULT→HOVER state table |
| "smooth transition" | exact duration + easing value |
| "add appropriate padding" | exact px/rem value |
| "use a gradient" | exact direction + stop values + hex codes |
| "make it feel premium" | specific design decisions that produce that feeling |
| "add content here" | exact content or Unsplash URL with aesthetic description |
| "similar to" | copy the exact value, don't reference by comparison |

Additional banned flattening patterns:
- "Shows [device] with [app/interface/UI]" → must describe what's ON the screen AND what's around the device
- "Large [animation/illustration/graphic]" → must specify dimensions, element count, arrangement
- "Warm/cool palette" → must list every color with hex and role
- "Text animates in" → must specify per-word/per-line, stagger, easing, duration
- "Cards/elements appear" → must specify how many, from where, in what order, with what timing
- "[N] items" without describing layout → must specify grid/flex/stack, gaps, alignment

---

## Failure Protocol

If any item is unchecked:
1. Identify exactly what's missing
2. Generate the missing content inline using the correct format from the Site DNA (don't soften or approximate)
3. Insert it into the correct location in the prompt
4. Re-check that item before proceeding

Do not deliver until all applicable items are checked.

---

## Delivery

Once all applicable items pass:

1. **Save output:** Write the final verified prompt to `plans/04-final-prompt.md` following `../templates/final-prompt.template.md`.
2. Output the complete final prompt in a single fenced code block so the user can copy and paste it cleanly.
3. Confirm: "Your replication prompt is ready. Paste it into Claude or your preferred code generation tool to build the site. All phase outputs are saved in `plans/`."
