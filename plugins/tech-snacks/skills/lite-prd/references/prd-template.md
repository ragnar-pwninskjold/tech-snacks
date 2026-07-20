# lite-prd output template

Fill this from the Q&A log and write it to `docs/lite-prd/<slug>/lite-prd.md`. Keep the section order and the `- [ ]` checkbox style. The **Monetization** section is intentionally omitted.

Bracketed text is guidance — replace it, don't emit it. Drop any bullet the interview genuinely didn't cover, but don't drop whole sections; if a section is unsupported, write `TBD — see Critical Questions` under it and add the open item to the Critical Questions section.

```markdown
# <Feature name> — Lite PRD

## Elevator Pitch

<One or two sentences: what this is and the value, in plain language.>

## Problem Statement

<What's broken today and the cost of leaving it broken.>

## Target Audience

<Who this is for. Segments, roles, or personas the interview surfaced.>

## USP

<Why this approach over the alternatives / status quo.>

## Target Platforms

<Web, iOS, Android, desktop, CLI, etc. — only what the user confirmed.>

## Features List

### <Feature Category>

- [ ] [Requirement, ideally as a user story: "As a <role>, I want <capability> so that <outcome>."]
  - [ ] [Sub-requirement or acceptance requirement]

### UX/UI Considerations

- [ ] [Screen or interaction]
  - [ ] [The different "states" of that screen — empty, loading, populated, error, permission-denied]
  - [ ] [How it handles state changes visually]
  - [ ] [Animations, information architecture, progressive disclosure, visual hierarchy]

### Non-Functional Requirements

- [ ] [Performance]
- [ ] [Scalability]
- [ ] [Security]
- [ ] [Accessibility]

## Critical Questions or Clarifications

- [ ] [Anything still unresolved after the interview — carried here verbatim, not guessed.]
```
