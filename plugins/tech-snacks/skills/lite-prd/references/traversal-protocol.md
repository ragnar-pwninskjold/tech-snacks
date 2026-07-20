# Traversal protocol

How to run the interview as a design-tree traversal with `AskUserQuestion`, persist it, and know when to stop.

## The design tree

Think of the ask as the root of a tree. The top-level branches are the PRD's dimensions:

- **Problem & audience** — what's broken, for whom, why now.
- **Core behavior** — the primary user story and the happy path.
- **Scope boundaries** — what's explicitly in vs. out of this cut.
- **UX / states** — screens, states (empty/loading/populated/error/permission), transitions.
- **Platforms & constraints** — where it runs; performance, scale, security, accessibility bars.
- **Edge cases & failure** — what happens when things go wrong or inputs are weird.

Each answer is a node. An answer **branches** when it opens a genuinely new sub-question the parent didn't cover (e.g. "users can invite teammates" → *by email or by link? what roles? what if the invitee has no account yet?*). Follow that thread down before returning to breadth.

## Batching with AskUserQuestion

- Ask **2–4 questions per round** — group related questions into one `AskUserQuestion` call so the user answers a coherent cluster at once.
- For each question give 2–4 concrete, mutually-exclusive options. Make the first option your recommended default and label it `(Recommended)` when you have a real recommendation. The user can always pick "Other".
- Use short, specific `header` chips (≤12 chars): "Audience", "Auth", "States", "Platform", etc.
- Set `multiSelect: true` when the options aren't mutually exclusive (e.g. "which platforms?").
- Prefer previews (ASCII mockups, option snippets) when the choice is easier to make by seeing it.

Start with a **root round** covering Problem & audience + Core behavior. Then let the answers steer which branch you descend next.

## Branch vs. advance

After reading each round's answers, decide per thread:

**Default mode (no flag) — model-judged, bias to fewer:**
- Branch deeper ONLY when an answer materially changes scope, contradicts an earlier answer, or leaves a real ambiguity that would block writing that PRD section.
- Otherwise advance to the next unexplored top-level branch.
- Prefer finishing over exhausting the budget. A tight, complete PRD beats an exhaustive interrogation.

**`--deep` mode — exhaustive:**
- Pursue every plausible sub-thread an answer opens, depth-first, until that thread is dry.
- Keep going across all branches until the tree yields nothing new or the budget is hit.

## Budget & stop conditions

- Hard cap: **50 questions total** across all rounds. Track the running count and never exceed it.
- Stop early (default mode) when every top-level branch is covered and no answered thread left a blocking ambiguity.
- When you hit the cap mid-traversal, stop asking and route every still-open thread into the PRD's **Critical Questions or Clarifications** section — don't guess.

## Persistence (do this every round)

Immediately after the user answers a round — **before** asking the next batch — append the round to `docs/lite-prd/<slug>/qa-log.md`. This makes the run resumable and auditable. Format each round as:

```markdown
## Round N — <branch name>

### Q: <question text>
- **Chosen:** <selected option label(s)>
- **Notes:** <any user "Other" text or annotation, if present>

### Q: <next question text>
- **Chosen:** ...
```

Number rounds sequentially: N is `(highest existing "## Round" number in the file) + 1`, starting at 1. Never reuse or skip an N.

Seed the top of `qa-log.md` once, before Round 1 (replace the bracketed placeholders, and write the actual mode — `default` or `--deep` — not the literal `default | --deep`):

```markdown
# Q&A log — <slug>

**Raw ask:** <verbatim feature ask from the user>

**Mode:** <default | --deep — pick the one this run used>
```

If `qa-log.md` already exists when the skill starts, read it and resume: derive the next N from the highest existing `## Round` header, continue the running question count from the rounds already logged, and **honor the `Mode:` recorded in the log** unless the user passed a mode flag this invocation (an explicit flag this run overrides the stored mode — update the `Mode:` line if it changed).
