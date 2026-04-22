# Step 1.5 — UX Philosophy (required)

Runs whether the user brought a PRD or built one in Step 1. The feature set is locked by this point — divergence in this step is on **UX expressions / organizing metaphors**, not features.

## Workflow

1. **Diverge — ~10 UX expressions.** Each expression names a mental model for how the locked PRD feature set could cohere. Examples for a food-journal app: "timeline-first journal," "quick-capture + end-of-day review," "goal-dashboard with logging as sub-task," "conversational capture," "map-first spatial log," etc. Each is a short description, not a full design.

2. **Adversarial filter.** Apply the criteria in `references/divergent-convergent-pattern.md`: cull cargo-culted, redundant, off-brief (violates Non-Goals / platform / audience), shallow. Internal — the user does not see the full 10.

3. **Synthesize into 3 philosophies.** Combine surviving expressions into 3 coherent, distinct app-level philosophies. Each philosophy is a consistent set of expression choices made across every feature in the PRD — not a grab-bag.

4. **Present each philosophy to the user** with:
   - **Organizing metaphor / mental model** — one sentence.
   - **How the PRD's features map into this structure** — per-feature breakdown.
   - **Trade-offs** — what this approach is good at, what it sacrifices.
   - **Recommendation flag** — flag ONE of the 3 as recommended, with honest reasoning. Flagging is allowed; auto-selecting is not.

5. **User chooses.** The user picks one, requests a hybrid, or asks for regeneration with different constraints.

## Edge Case: User Rejects All Three

Do not force a choice. Offer to either:
- Regenerate with different divergence axes (ask what felt wrong — too similar? too conservative? missed a specific metaphor?), or
- Take user-supplied axes as constraints and re-diverge.

## Output

File: `01b-ux-philosophy.md`, using `templates/ux-philosophy.template.md`. Contains the chosen philosophy in full plus the two rejected alternatives for audit.

## Phase Gate

After `01b-ux-philosophy.md` is written, show a one-sentence summary of the chosen philosophy and ask the user to confirm or refine before Step 2.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "User is in a hurry, I'll just pick the recommended one" | The skill never auto-selects. Always wait for the user's choice. |
| "3 philosophies look similar, it's fine" | If they're not distinct, re-synthesize. Distinctness is the whole point. |
| "Trade-offs feel negative, soften them" | Trade-offs are the point. Honest reasoning helps the user choose. |
| "User picked hybrid, that means they're uncertain — push back" | Hybrids are a valid outcome. Record the blend faithfully in `01b-ux-philosophy.md`. |
| "Features should also be re-opened here" | Features are locked. This step is expressions-only. |
| "Go with #1, [chosen philosophy]." — state the pick decisively | Flagging a recommendation is allowed. Stating a decision is auto-selecting. Show 3 + flag 1; wait for the user. |
| "The PRD literally says X — this philosophy is the clear winner" | PRD alignment is a recommendation input, not a decision. Three philosophies can all be PRD-aligned in different ways. Present all three. |
| "It's the fastest to build, just go with that one" | Implementation speed is out of scope for this step. UX philosophy selection is the user's call, not a build-cost optimization. |
| "If you want to move, I'd suggest I draft the next artifact for [the one I like]" | Do not assume a choice has been made. Wait for the user to name their pick before preparing next-step artifacts. |
