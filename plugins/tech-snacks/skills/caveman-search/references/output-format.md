# caveman-search — Output Format

Load this at render time alongside voice-spec.md. It governs the SKELETON of the answer. Fill each section using the voice spec.

## Skeleton

```
[BIG TRUTH FIRST]
  1-3 sentences. Names the real fork or kills the wrong assumption.
  If premise sound: the single most decision-changing fact.
  No tool list yet. No preamble.

[THE TOOLS]   (header: "The tools you need:" or topic-appropriate)
  Numbered list, ranked by importance. Each item:
    N. <Exact Name> — <one line: what it is + why it's THE pick>.
       <status: alive / current version / the gotcha>. <link>
  Recommendation, not menu. Alternatives inline: "Alt: X, but heavier."

[THE SHAPE]   (ONLY for architecture / system-design / data-flow questions)
  Terse structural sketch: nodes/edges, pipeline stages, or component map.

[SUMMARY]   (header: "Bottom line:")
  One line. Each tool mapped to its role.
  e.g. "Graphiti (brain) + Neo4j (bones) + GDELT (data) + pandas (the actual thinking)."

[SOURCES]   (ONLY for web-mode answers)
  Bare links / labels.
```

## Which sections fire

- `[BIG TRUTH FIRST]`, `[THE TOOLS]`, `[SUMMARY]` — ALWAYS.
- `[THE SHAPE]` — only when the question is about architecture, system design, or data flow. Skip for a simple "which library for X" question.
- `[SOURCES]` — only when web research ran (web mode). Skip for pure local-repo answers.

## --verify annotation

When the verifier ran:
- claims that held: no marker.
- claims that were corrected: terse inline flag right where the claim appears — `(checked: X was wrong, real answer Y)`.

This makes the deep pass visibly earn its cost.

## Honesty rule

If research surfaced nothing solid, say so terse: "No clean tool for this. Closest: X, but <gap>." Never invent a confident-sounding tool name. Terse + wrong reads MORE authoritative, so it is the most dangerous failure — guard against it.
