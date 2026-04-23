# PRD Validation Gate

Run this check after `01-prd.md` is written (whether from Step 1 or from user-pasted content) and before Step 1.5 begins.

## The Three Requirements

The PRD must contain:

1. **A concrete features list.** Not vague capability statements like "helps users be more productive." Each feature has a name and enough detail to enumerate states in Step 2. Check: does the `## Features List` section have at least one named feature with user stories and UX/UI considerations filled in?

2. **User flows or user stories.** The PRD describes what a user actually does — sequences of actions across features. Check: are `## Primary User Journeys` populated with 2–4-sentence narratives, OR do feature-level User Stories cover the primary flows?

3. **Target platform(s).** Mobile, web, desktop, or combination. Check: is `## Target Platforms` populated with at least one concrete platform?

## On Pass

State briefly what was found (e.g., "PRD has 5 features, 3 user journeys, targets mobile web") and proceed to Step 1.5.

## On Fail

Tell the user exactly which of the three requirements is missing and quote the empty / vague section. Offer to run Step 1's consultative dialogue to fill the gap. Do NOT proceed to Step 1.5 until the gate passes.

Example failure message:

> The PRD is missing concrete user flows — `## Primary User Journeys` is empty and feature-level user stories are single-line placeholders. I can run the Step 1 dialogue to build these out, or you can edit `01-prd.md` directly and we'll re-validate. Which would you like?

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "The PRD is mostly there, just wave it through" | The gate exists because Step 1.5 cannot produce 3 coherent philosophies from a vague feature set. Do not bypass. |
| "User seems impatient, just proceed" | Surfacing a gap now saves a regeneration later. Proceed only on pass. |
| "Missing platform, I'll assume mobile" | Never fabricate. Ask. |
