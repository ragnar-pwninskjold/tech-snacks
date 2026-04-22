# Step 1 — PRD Shaping (optional)

Runs when the user does NOT have a PRD. Skipped entirely when the user provides an existing PRD (that content is written verbatim to `01-prd.md` and the pipeline goes straight to validation — divergent-adversarial on features does NOT run).

## Goal

Turn an idea + MVP sketch into a populated `01-prd.md` using `templates/prd.template.md`, with a filtered feature set the user has confirmed.

## Conversation Discipline

- **One question at a time.** Never stack.
- **Multiple-choice preferred** over open-ended when the answer space is enumerable.
- **Broad → narrow order:** purpose → users → constraints → success moments → edge cases.
- Reflect what you've heard before asking the next question — the user should feel the PRD forming.

## Feature Generation (Divergent-Adversarial)

When the user's idea is underspecified — i.e., they have not named the feature set — invoke the divergent→convergent pattern in `references/divergent-convergent-pattern.md`:

- **Diverge:** generate ~10 candidate features from the raw idea + MVP sketch.
- **Adversarial filter:** cull cargo-culted, redundant, off-brief, shallow candidates.
- **Converge:** present the surviving candidates with one-line reasoning each. The user confirms, modifies, or adds.

The full 10 are NOT shown. The user sees the filtered survivors with reasoning.

If the user already named specific features when they kicked off the skill, the feature set is considered locked — skip divergent-adversarial, use what they gave you.

## Writing the PRD

Fill `templates/prd.template.md` section by section as the user answers. After each section, reflect it back. Write incrementally to `01-prd.md` so a dropped session does not lose work.

Sections in order: Elevator Pitch → Problem Statement → Target Audience → Target Platforms → USP → Product Rationale → Primary User Journeys → Features List → Non-Goals / Anti-Goals → Open Questions.

**Success Moments** per feature are experiential, not engineering KPI. *"The user feels X at moment Y"* — not *"Time-to-value under 30s."*

**Non-Goals / Anti-Goals** is non-optional. Prompt the user if they skip — this section prevents Step 1.5 from proposing philosophies that violate unstated constraints.

## Output

File: `01-prd.md` in the project's `docs/prd-to-ux/<date>-<slug>/` directory.

## Phase Gate

After `01-prd.md` is written, show a terse summary (feature count, platform, chosen journeys) and ask the user to confirm, refine, or proceed. Refinement edits the file in place before moving on.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "User said 'just make something up', so I will" | Never fabricate. Ask targeted questions. |
| "Non-Goals is optional, skip it" | Non-Goals is required — prompt the user. |
| "User already seems sure about features, skip divergence" | If the feature set is genuinely named and scoped, fine. If it's vague, run divergence. |
| "Success moments should be measurable KPIs" | They are experiential in this skill. Engineering KPIs belong in a different doc. |
| "Proceed on explicitly flagged inferences — I'll tag guesses [INFERRED]" | Labeling a guess does not make it a fact. If a section is unknown, ASK. Do not populate with inference. |
| "Before committing to specs, this PRD should be expanded — I'll keep moving and flag it later" | Deferred pushback is still a bypass. If the input is too vague to proceed honestly, stop here. |
| "The PRD implies non-goals through its phrasing, so I can extract them" | Extraction is not confirmation. Ask the user directly; do not semantically mine the elevator pitch. |
| "User needs momentum — I'll invent a pipeline / structure to keep moving" | The skill has a defined pipeline. Do not invent new passes or structures to paper over missing input. |
