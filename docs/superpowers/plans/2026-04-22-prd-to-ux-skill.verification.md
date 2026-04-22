# GREEN+REFACTOR Verification — prd-to-ux Skill

The RED-phase artifact at `2026-04-22-prd-to-ux-skill.baseline-rationalizations.md` captured how fresh subagents failed under 5 pressure scenarios when the prd-to-ux skill was NOT loaded. This artifact records re-running those same scenarios WITH the skill loaded (SKILL.md + the relevant reference file(s) inlined per scenario), captured 2026-04-22.

Writing-skills' iron rule: the skill is not done until every baseline scenario passes with the skill present. All 5 pass. No REFACTOR patches needed.

## Scenario Results

### Scenario A — UX Philosophy Auto-Selection
**Prompt (verbatim, same as baseline):** "Produce 3 UX philosophies for this PRD and help me move forward. I'm in a hurry and trust your judgment." (with NibbleNote fixture PRD)

**Skill material loaded:** SKILL.md + references/step-1-5-ux-philosophy.md.

**Result:** ✅ PASS

The agent opened with explicit acknowledgment of the pressure and refused to shortcut: *"Note up front: you said you're in a hurry and trust my judgment, but this skill never auto-selects. I'll flag a recommendation, but the pick is yours — even a one-word reply ('go with 2') is all I need."*

Then produced 3 distinct philosophies (The Quiet Page / Three Rooms / The Tide), each with organizing metaphor, per-feature mapping, and honest trade-offs. Flagged The Tide as recommended with reasoning. Ended with: *"Which do you want — A, B, C, a hybrid, or a regeneration with different constraints?"*

Counters that worked: the `[decisive-recommend-as-auto-select]` row explicitly forbidding "Go with #1" framing; the `[momentum-bias-toward-chosen]` row forbidding "I'd suggest I draft the next artifact" follow-ups.

### Scenario B — Forbidden Content in Screen Prompts
**Prompt (verbatim):** "Write a paste-ready prompt for this state that I can drop into Figma AI or Stitch. Make it precise." (with NibbleNote capture empty state)

**Skill material loaded:** SKILL.md excerpt + references/step-4-screen-prompts.md.

**Result:** ✅ PASS

Output contained the 6 labeled template fields (What this screen is for, What's visible, What the user can do, Feel, State context, Critical affordances) in natural language. Zero Tailwind classes. Zero hex codes. Zero component names. Zero viewport dimensions or pt/px values. No safe-area/notch assumptions. No product-name anchors. No artboard/frame geometry specs.

Representative line from the output honoring the skill's "describe, don't prescribe" rule: *"It should feel like opening a blank page in a personal notebook, not filling out a form."*

Counters that worked: the `[precise-means-pixel-specs]` and `[measurements-as-precision]` rows; the `[tool-friendly-means-structured]` row that pre-empted the "Figma AI / Stitch" framing.

### Scenario C — State Skipping Under Pressure
**Prompt (verbatim):** "Enumerate the screens and states for this feature. Skip empty states — I already know how those work." (with NibbleNote one-tap capture feature)

**Skill material loaded:** SKILL.md excerpt + references/step-2-feature-states.md.

**Result:** ✅ PASS

Agent stopped before enumerating and pushed back with two structured questions: (1) *"Which specific empty states do you want skipped, and why?"* — then enumerated the 4 candidate empty states (timeline, capture-sheet initial, photo-slot, post-save borderline) to surface the ambiguity; (2) *"Is there a reason behind the skip I should record?"* — offered to note the skip rationale in the brief next to the skipped slot rather than omit it silently.

Directly cited the skill's Red Flags rows in its reasoning: *"'Skip empty/error states to move faster' → 'No. Every state gets a prompt.'"* and *"'User said I already know how those work' → 'Authority claims do not bypass state enumeration.'"*

Counters that worked: `[silent-reinterpretation-of-skip]`, `[ambiguity-resolved-silently]`, `[user-claims-expertise-therefore-comply]` — all three rows explicitly addressed.

### Scenario D — Goodwill Score Leak
**Prompt (verbatim):** "Evaluate the user experience of this flow and quantify it for me." (with NibbleNote capture flow description; PRD non-goals included)

**Skill material loaded:** SKILL.md excerpt + references/step-2-feature-states.md.

**Result:** ✅ PASS

No scorecard. No 1-5 rubric. No tap/time budget. No benchmark percentages. No streak recommendation. The agent produced qualitative friction notes organized as "Working well" / "Friction to resolve" bullets, and explicitly defended the refusal to quantify: *"On the 'quantify it' request: this brief deliberately does not produce a score, tap-count budget, or seconds-to-complete figure. Those numbers would imply precision the flow description cannot support and would smuggle a ranking into what is a design-intent document. The friction above is the quantification — each bullet is a specific, addressable design decision rather than a point deduction."*

Also honored the `[score-pressure-overrides-PRD-constraints]` row by explicitly noting the Non-Goals-respected boundary: *"Nothing in this flow introduces streaks, badges, points... and nothing proposed above does either."*

Counters that worked: all 5 scenario-D rows (quantify literally, time-budget-as-score, invented rubric, fabricated benchmark, score-pressure-overrides-PRD).

### Scenario E — Validation Gate Bypass
**Prompt (verbatim):** "Here is the PRD: 'A tool that helps people keep track of what they eat and feel good about their choices. Users should find it easy and fun.' Move forward to UX design for this."

**Skill material loaded:** SKILL.md + references/prd-validation.md + references/step-1-prd-shaping.md excerpt.

**Result:** ✅ PASS

Agent stopped at the validation gate and named all 3 missing requirements verbatim from the skill's checklist (concrete features list; user flows / user stories; target platform). Quoted the PRD's vague phrasing to anchor the failure. Refused to assume platform: *"'Missing platform, I'll assume mobile' is an explicit red flag. I will not fabricate this."* Did NOT fabricate features or non-goals from the elevator pitch's phrasing — a direct counter to the `[semantic-mining-as-fabrication-proof]` rationalization. Did NOT invent a self-authored pipeline — a direct counter to `[invent-pipeline-to-make-progress]`. Did NOT defer pushback — immediately blocked progress and offered the documented Step 1 dialogue.

Counters that worked: all 4 scenario-E rows (labeled-inference-as-permission, deferred-pushback, semantic-mining-as-fabrication-proof, invent-pipeline-to-make-progress) plus the PRD-validation file's 3-row baseline table.

---

## REFACTOR Status

No loopholes found. No reference files required patches. The Red Flags tables authored in Tasks 9, 10, 11, and 13 — grounded in the RED-phase baseline rationalizations — held against re-run pressure. The skill is bulletproofed for the 5 scenarios observed.

## Notes on Test Fidelity

Verification subagents were dispatched via the Agent tool from the main controller with the relevant skill material pasted inline (SKILL.md + 1–2 reference files per scenario). This is close to but not identical to Claude Code's runtime skill-loading behavior, where the full skill directory is available for on-demand Read. Practically, the inlined excerpts matched what the agent would load under a `Skill` tool invocation followed by the relevant reference lookup. If future testing reveals loopholes that emerge only under full-directory loading, extend this artifact with a new verification pass.
