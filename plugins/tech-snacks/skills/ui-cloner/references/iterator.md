# UI Cloner — Iterator: Refinement Loop

## Overview

Takes a poorly-executed first attempt and systematically closes the gap to the reference. Runs 5 passes, each comparing the current implementation against the Site DNA document to identify the most impactful remaining delta and produce a corrective prompt.

**Announce:** "Running the UI Cloner Iterator — 5 refinement passes against the Site DNA."

**Prerequisite:** `plans/01-site-dna.md` must exist in the current project directory. Read it before starting Pass 1.

The output artifact shape (5 passes + master summary) lives in `../templates/iterator.template.md`.

---

## Input Required

Before starting, confirm you have:
1. **The Site DNA** — read from `plans/01-site-dna.md`
2. **The current implementation** — a screenshot, URL, or code the user provides showing what was built

If either is missing, ask for it before proceeding.

---

## The 5-Pass Refinement Loop

Run all 5 passes sequentially. Each pass follows the same structure:

### Pass Structure

**1. Compare** — Scan the current implementation against the Site DNA. Identify what's still wrong or missing. Use Claude with chrome for visual checking *MANDATORY*.

**2. Prioritize** — Rank the 3 most impactful gaps by visual/functional severity:
- `[CRITICAL]` — breaks the identity (wrong colors, wrong fonts, missing core layout)
- `[MAJOR]` — significantly degrades quality (wrong spacing, missing animations, off-brand components)
- `[MINOR]` — polish items (timing values, easing curves, copy voice)

**3. Generate** — Write a precise corrective prompt targeting ONLY the top 3 gaps from this pass. The prompt must:
- Reference exact values from the Site DNA (hex codes, timing, easing, component names)
- Describe the current wrong state and the correct target state
- Use pseudocode-level specificity (not "fix the button color" but "change button bg from #333 to `#150b07`, border-radius from 4px to 48px, font to Inter 400")

**4. Advance** — After generating the corrective prompt, note what was addressed and what remains for the next pass.

---

## Pass 1 — Foundation Audit

**Focus:** Color palette, typography, and overall background atmosphere.

These are the highest-leverage corrections — if the background, fonts, and primary colors are wrong, every subsequent detail is built on sand.

Check against Site DNA sections: 1.2 (Design Tokens), 1.3 (Atmosphere & Texture).

---

## Pass 2 — Layout & Spacing Audit

**Focus:** Section structure, grid philosophy, whitespace rhythm, and card geometry.

Check against Site DNA sections: 1.1 (Macro Layout), 1.2 (Border Radius, Spacing System).

---

## Pass 3 — Component Fidelity Audit

**Focus:** Individual component accuracy — nav, feature cards, stats, carousels, FAQ, footer.

Check against Site DNA sections: 1.6 (Component Behavior), 1.5 (Micro-Interactions).

---

## Pass 4 — Motion & Animation Audit

**Focus:** Entrance animations, scroll triggers, hover states, and timing values.

Check against Site DNA sections: 1.4 (Scroll & Entrance Animations), 1.5 (Micro-Interactions), 1.8 (Motion Philosophy).

---

## Pass 5 — Voice & Polish Audit

**Focus:** Copy structure, italic accent pattern, rhetorical devices, and any remaining visual polish.

Check against Site DNA sections: 1.9 (Copywriting Voice), 1.2 (typography italic/color pattern).

---

## Output Format Per Pass

Use the per-pass block scaffold in `../templates/iterator.template.md`. Each pass produces: gaps identified (with severity tags), corrective prompt (paste-ready), and a transition note for the next pass.

---

## Final Synthesis (After Pass 5)

After completing all 5 passes, output a **Master Correction Summary**:

1. A ranked list of all gaps addressed across all 5 passes
2. A single consolidated "Final Dial-In Prompt" that combines the most critical unfixed items into one comprehensive corrective instruction

**Save output:** Write the full iterator output (all 5 passes + master summary) to `plans/05-iterator.md` following `../templates/iterator.template.md`.

---

## Rules

- **Never skip a pass.** Even if the implementation looks good, run all 5 — later passes surface polish issues that kill quality.
- **Each corrective prompt must be self-contained.** A developer should be able to paste it directly without reading prior passes.
- **Cite the Site DNA.** Every correction must reference exact values from the DNA document, not generic advice.
- **Do not re-audit already-corrected gaps.** Each pass moves forward. If Pass 1 fixed the background color, Pass 2 does not mention it again.
