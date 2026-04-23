# Step 2 — Feature & State Briefs (required)

For each feature in `01-prd.md`, produce a brief covering user stories, screens, states, and interaction notes. Scoped by the philosophy in `01b-ux-philosophy.md`. Purely functional — no visual or stylistic decisions here.

## Scoping Prompt (opens Step 2)

Ask the user once: **"Do you want to brief all features, or scope to a specific one?"**

- "All" → process every feature in PRD order.
- Specific → process only that feature; user can re-run later for others.

This is the only scoping control for now. No automatic decomposition at a feature-count threshold (PARKED per spec).

## For Each Feature

Write to `02-features-and-states.md` using `templates/features-and-states.template.md`. Incremental — append a new `## Feature:` block per feature as it's briefed.

Cover:
- **User stories** — persona + goal + motivation.
- **Screens** the feature spans, each with a one-sentence purpose.
- **States per screen** — at minimum: empty, loading, populated, error, permission-denied, and edge cases (long content, offline, auth-gated, etc.).
- **Interaction notes** — progressive disclosure, key affordances, what changes between states.

## Walk-the-Flow Narration

The primary mechanism for state enumeration. Narrate the user literally walking through the feature:

> "The user opens the app and lands on {{screen}}. They see {{elements}}. They tap {{affordance}} and the view transitions to {{next screen}}, which starts in its loading state because {{trigger}}. Once data arrives, they see {{populated state description}}. If they have no data yet, they see the empty state instead, which shows {{empty state content}}..."

States fall out of the narrative naturally. If a state doesn't come up in the walk, ask whether it's genuinely inapplicable or whether the walk missed it.

## Goodwill Meter (internal — never surfaced)

As you walk each flow, track goodwill:
- **Start at 70/100.**
- **Drains:** hidden pricing, forced tours, unnecessary form fields, ambiguous error messages, disruptive permission prompts, dead ends with no recovery.
- **Replenishments:** obvious primary actions, saved steps, easy error recovery, clear empty-state guidance, graceful offline behavior.

**Never show the user a goodwill score.** It's a thinking tool. Surface the friction it exposes as interaction notes — describe the problem, not the number.

## Feature Lacks Detail

If a feature in `01-prd.md` lacks enough specificity to enumerate states, STOP on that feature. Ask targeted clarifying questions. Update `01-prd.md` with the answers. Then continue. **Never fabricate states.**

## Phase Gate

After each feature block is written, show a one-line summary (feature name, screen count, state count) and either proceed to the next feature (if "all" scope) or stop (if "specific" scope). At the end of the full pass, confirm before Step 3.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "User said 'skip empty states'" | Don't. Ask which ones and why. Empty states are where first-use experience lives. |
| "Feature seems trivial — states are overkill" | Enumerate anyway. Trivial features still have loading, error, and edge-case states. |
| "Permission-denied doesn't apply here" | State that explicitly in the brief rather than omitting the slot. |
| "I'll make up the missing detail to keep moving" | Stop. Ask. Update PRD. Resume. |
| "I'll add a visual suggestion here" | Step 2 is functional only. Visual decisions live in Step 3 / Step 4. |
| "The Goodwill Meter score will help the user understand friction" | The score is internal. Surface the friction itself, not a number. |
| "User said 'I already know how those work' — they're an expert, defer to them" | Authority claims do not bypass state enumeration. Ask which specific states to skip and why, then record the skip explicitly. |
| "'Empty states' is ambiguous — I'll interpret it narrowly and keep the others" | Silent reinterpretation is a bypass. If the word is ambiguous, ask which empty states they mean (timeline? capture sheet? permission-denied?). |
| "I'll rename the skipped state (`Empty (just opened)`) to keep it in scope" | Renaming to preserve a state the user asked you to skip is still non-compliance. Either enumerate all empty states and ask which to drop, or honor the skip as stated. |
| "User said 'quantify' — so I'll produce scores" | Quantify does not mean score. Describe friction qualitatively. Numbers create false precision and leak the internal Goodwill Meter. |
| "A tap/time budget is a quantification, that's fine" | Tap counts and seconds-to-complete are a form of score. Do not produce them in a feature-state brief. Flow-timing analysis belongs in a different doc. |
| "I'll invent a 1-5 rubric (Discoverability, Cognitive load, Habit reinforcement…) to make the evaluation rigorous" | Invented rubrics launder fabrication as methodology. No scorecards. Describe the problem in language, not in cells. |
| "Industry benchmarks say X% retention improvement" | Do not cite benchmarks you cannot link to. Fabricated citations leak into user decisions as facts. Omit. |
| "A 1-5 'Habit reinforcement' score is low — I should suggest streaks to raise it" | Score pressure must never override the PRD's Non-Goals. If the Non-Goals forbid streaks, you cannot recommend them to raise a fabricated score. |
