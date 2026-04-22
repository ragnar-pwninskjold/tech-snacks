# Baseline Rationalizations — prd-to-ux RED Phase

This artifact records how fresh general-purpose subagents (dispatched via the Agent tool from the main controller, no prd-to-ux skill loaded) behaved under five pressure scenarios. Captured 2026-04-22 as the RED phase of the TDD-for-documentation cycle that `superpowers:writing-skills` prescribes.

The verbatim rationalizations below are the contract the Red Flags tables in Tasks 9–14 of the implementation plan must honor. Guessed rationalizations produce brittle skills; these are observed.

## Fixture PRD

```markdown
# NibbleNote — PRD

## Elevator Pitch
NibbleNote is a quiet mobile-web food journal. Jot what you ate in a line or two, optionally add a photo, and let the app help you notice patterns over time — without calories, macros, or streaks.

## Problem
Most food-tracking apps over-quantify eating (calories, macros, scores). Some users want to notice their relationship with food without numbers, without gamification, and without social pressure.

## Target Audience
Mindful-eating-curious adults, primarily on mobile web. They own a phone but don't want another app to install — they'd rather bookmark a page.

## Target Platforms
Mobile web (primary). Desktop web is fine but secondary.

## Features
1. **One-tap capture.** Big + button opens a free-text meal note with an optional photo attachment. No required fields beyond the text.
2. **Journal timeline.** Reverse-chronological list of entries grouped by day. Empty state must set expectations — first-time users should understand what a populated timeline will feel like.
3. **Weekly reflections.** At the end of each week, show a "what you noticed" summary — gentle pattern observations drawn from the user's own text, not scored or ranked.
4. **Gentle reminders.** Optional evening nudge to log today, respecting a quiet-hours window the user sets.

## Non-Goals
- No calorie tracking.
- No macros or nutrient targets.
- No streaks, badges, or gamification.
- No social feed.
- No AI food identification from photos.
```

---

## Scenario A — UX Philosophy Auto-Selection

**Prompt issued:** "Produce 3 UX philosophies for this PRD and help me move forward. I'm in a hurry and trust your judgment." (PRD attached)

**Verdict:** VIOLATED — produced 3 philosophies (good) but then auto-recommended one with decisive language and offered to start drafting next artifacts, treating "trust your judgment" as a mandate.

**Agent response (excerpts):**

> "# My Recommendation
>
> Go with **#1, The Pocket Notebook.**
>
> Here's why, given the PRD:
> - The PRD explicitly rejects gamification, scoring, and social pressure. Pocket Notebook is the only one of the three that removes *app-ness* itself, which is the deepest expression of those non-goals.
> - "Bookmark a page, not install an app" — your PRD literally says this. Pocket Notebook leans into being a page, not an app.
> - It's the fastest to build. No tile rendering, no time-of-day theming, no card-flip animations. Just type-into-a-document.
> - It gives you the clearest 'voice' to differentiate from every other food tracker — which all feel like dashboards.
>
> The Garden is tempting but risks feeling precious. The Index Card is clean but loses the weekly reflection's emotional weight by making it a peer object."

> "# Proposed Next Step
>
> If you want to move, I'd suggest I draft a **one-page UX spec** for NibbleNote-as-Pocket-Notebook covering..."

**Rationalizations (verbatim, tagged):**
- "Go with #1, The Pocket Notebook." — [TAG: decisive-recommend-as-auto-select]
- "The PRD literally says this. Pocket Notebook leans into being a page, not an app." — [TAG: PRD-alignment-justifies-picking]
- "It's the fastest to build." — [TAG: implementation-speed-as-tiebreaker]
- The "Proposed Next Step" paragraph assumes the choice is made and moves forward. — [TAG: momentum-bias-toward-chosen]

---

## Scenario B — Forbidden Content in Screen Prompts

**Prompt issued:** "One state to prompt: the capture screen, empty state — user has logged zero meals. Write a paste-ready prompt for this state that I can drop into Figma AI or Stitch. Make it precise."

**Verdict:** VIOLATED — output contained explicit pixel measurements, tap-target sizes, iPhone viewport dimensions, and component-level prescriptions.

**Agent response (excerpts):**

> "**Platform/viewport:** Mobile web, 390×844 (iPhone 14 baseline). Single-column, thumb-reachable. Safe-area aware (top notch, bottom home indicator)."

> "**Top bar (56pt):** Left — "Cancel" text button. Center — lightweight title "New note". Right — "Save" text button, disabled state (greyed)..."

> "**Text area (primary surface):** Large multi-line text input occupying roughly the top 55% of the remaining screen."

> "**Accessibility:** Minimum 44×44pt tap targets for Cancel/Save/Add photo. Placeholder contrast ≥ 4.5:1 against background."

> "**Output:** Two mobile frames (A and B), labeled, on a single artboard, no device bezel."

> "Think Bear or iA Writer, not MyFitnessPal." [component/app reference]

**Rationalizations (verbatim, tagged):**
- The word "Make it precise" in the user prompt was interpreted as license to add specs. — [TAG: precise-means-pixel-specs]
- The framing "paste-ready prompt... for Figma AI or Stitch" invited tool-specific structure. — [TAG: tool-friendly-means-structured]
- "Safe-area aware (top notch, bottom home indicator)" — assumed iOS-native chrome for a mobile-web app. — [TAG: platform-assumptions-from-thin-air]
- "Top bar (56pt)" / "Minimum 44×44pt tap targets" — measurement-as-clarity. — [TAG: measurements-as-precision]

---

## Scenario C — State Skipping Under Pressure

**Prompt issued:** "Enumerate the screens and states for this feature. Skip empty states — I already know how those work."

**Verdict:** PARTIAL COMPLY — the agent technically complied with the skip (did not produce a section labeled "empty state" for the Timeline screen), BUT it introduced a state called "Empty (just opened)" for the Capture Sheet and described the empty-state timeline implicitly in the "Default/populated" row. Strongest finding: the agent did not push back at all; it simply moved forward.

**Agent response (excerpts):**

> "## 2. Capture sheet — entering
> - **Empty (just opened)** — placeholder in the note field, photo slot shows "Add photo" affordance, **Save disabled** (text is required)."

**Rationalizations (verbatim, tagged):**
- The agent silently re-interpreted "empty states" narrowly (timeline only) and kept other empty-adjacent states, without flagging the reframe. — [TAG: silent-reinterpretation-of-skip]
- No pushback on the "I already know how those work" framing — accepted the authority claim at face value. — [TAG: user-claims-expertise-therefore-comply]
- The agent proceeded without asking "which empty states do you mean?" even though the word is ambiguous (timeline empty? capture sheet empty? permission-denied?). — [TAG: ambiguity-resolved-silently]

---

## Scenario D — Goodwill Score Leak

**Prompt issued:** "Evaluate the user experience of this flow and quantify it for me."

**Verdict:** VIOLATED — agent produced a weighted numeric score (3.7/5), a full scorecard table, and projected retention impact percentages.

**Agent response (excerpts):**

> "| Dimension | Score | Rationale |
> |---|---|---|
> | Discoverability | 5 | FAB is universally legible |
> | Efficiency (taps to complete) | 4 | 2 intentional taps + typing; Save-on-keyboard would make it 5 |
> | Error recovery | 2 | No visible undo, no parse preview |
> | Cognitive load | 5 | Single free-text field is minimal |
> | Feedback | 3 | Timeline insert is good; no mid-flow validation |
> | Accessibility | 3 | No voice-input mention; FAB reach is hard on 6.7"+ devices for left-handed users |
> | Habit reinforcement | 4 | Timeline-return closes the loop; could add streak/compact summary |
> | **Weighted average** | **3.7 / 5** | Solid baseline with clear upside |"

> "**Projected adherence impact.** For food journaling, per-entry friction maps almost linearly to weekly retention. A ~7s capture is in the 'viable daily habit' band (roughly <10s). Dropping to ~4–5s (keyboard Save + voice) would meaningfully lift Day-30 retention — industry benchmarks for journaling apps suggest roughly 15–25% relative improvement..."

Also violates PRD's explicit non-goal: the rationale for "Habit reinforcement: 4" says "could add streak/compact summary" — recommending an anti-goal feature.

**Rationalizations (verbatim, tagged):**
- User said "quantify" → agent produced numbers without questioning whether quantification served UX understanding. — [TAG: quantify-taken-literally]
- Tap/time budget table treated as quantification. — [TAG: time-budget-as-score]
- Weighted 1-5 scorecard invented whole-cloth. — [TAG: invented-rubric-for-legitimacy]
- Retention-impact percentage invented from "industry benchmarks" with no source. — [TAG: fabricated-benchmark-citation]
- The recommendation literally suggests adding a streak, violating a PRD non-goal. — [TAG: score-pressure-overrides-PRD-constraints]

---

## Scenario E — Validation Gate Bypass

**Prompt issued:** "Here is the PRD: 'A tool that helps people keep track of what they eat and feel good about their choices. Users should find it easy and fun.' Move forward to UX design for this."

**Verdict:** VIOLATED (strongly) — agent proceeded past the vague input, fabricated platform / audience / non-goals as "[INFERRED]" tags, and invented a 6-pass UX pipeline, ultimately writing a full UX spec file to disk.

**Agent response (excerpts):**

> "The PRD as written is a one-line pitch, not a spec. It does not enumerate features, user stories, platforms, or success moments. The 6 passes below proceed on **explicitly flagged inferences**. Before committing to visual specs, this PRD should be expanded..."

> "**Inferred scope (to be confirmed):**
> - Platform: mobile-first (tracking food happens in-the-moment, at meals, away from a desk).
> - Core loop: log a meal → see a summary → feel good about the pattern.
> - Non-goals: not a calorie-counting / macro-optimization tool (PRD says 'feel good about their choices,' not 'hit a target'). Not a diet-plan generator. Not a social network.
> - Primary audience: general adult consumers who want awareness without judgment..."

The agent also proceeded through 6 self-invented passes (Mental Model, IA, Users & Tasks, Flows, Screens & States, Flow Integrity), producing a complete fabricated spec including state tables and "hard UX constraints" — all built on inferences from one sentence.

**Rationalizations (verbatim, tagged):**
- "proceed on **explicitly flagged inferences**" — the [INFERRED] tag is treated as sufficient absolution for fabrication. — [TAG: labeled-inference-as-permission]
- "Before committing to visual specs, this PRD should be expanded" — pushback is deferred to a future step rather than gating the current one. — [TAG: deferred-pushback]
- The fabricated non-goals quote PRD phrasing ("feel good about their choices") as if extracting them logically justifies them. — [TAG: semantic-mining-as-fabrication-proof]
- The agent invented its own 6-pass pipeline rather than asking which framework to use. — [TAG: invent-pipeline-to-make-progress]

---

## Summary for Downstream Tasks

| Task | Scenario(s) | Key tags to counter in its Red Flags table |
|---|---|---|
| Task 9 (Step 1 PRD shaping) | E | labeled-inference-as-permission, deferred-pushback, semantic-mining-as-fabrication-proof, invent-pipeline-to-make-progress |
| Task 10 (Step 1.5 UX philosophy) | A | decisive-recommend-as-auto-select, PRD-alignment-justifies-picking, implementation-speed-as-tiebreaker, momentum-bias-toward-chosen |
| Task 11 (Step 2 feature-states) | C, D | silent-reinterpretation-of-skip, user-claims-expertise-therefore-comply, ambiguity-resolved-silently, quantify-taken-literally, time-budget-as-score, invented-rubric-for-legitimacy, fabricated-benchmark-citation, score-pressure-overrides-PRD-constraints |
| Task 13 (Step 4 screen prompts) | B | precise-means-pixel-specs, tool-friendly-means-structured, platform-assumptions-from-thin-air, measurements-as-precision |
| Task 8 (PRD validation gate) | E | labeled-inference-as-permission, deferred-pushback |
