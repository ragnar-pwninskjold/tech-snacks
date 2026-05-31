---
name: scaffold-claude
description: Use when the user wants to create, draft, or scaffold a CLAUDE.md (or AGENTS.md) file for their project. Triggers on "scaffold CLAUDE.md", "write a CLAUDE.md", "set up CLAUDE.md", "/scaffold-claude", or any request to bootstrap project-level Claude/agent instructions. Produces a scratchpad draft that captures edge cases and tribal knowledge — not derivable facts.
---

# scaffold-claude

Scaffold a `CLAUDE.md` for the user's project. Output is written to a **scratchpad** so the user can review and move it to the repo root themselves.

The file you produce documents **edge cases, non-obvious choices, and tribal knowledge** — things Claude *can't* read off `package.json`, the directory tree, or the README. If a fact is derivable, it does not belong in the file.

## The Iron Rule

**Never write a section based on inference. Always ask, and stub when the answer is "skip" or "I don't know."**

A stubbed section (a `<!-- TODO: ... -->` comment) is *strictly better* than a section filled with plausible-sounding guesses. Guesses encode false confidence that future Claude will trust.

## When to Use

- User says `/scaffold-claude` or asks to "scaffold/write/create CLAUDE.md"
- User asks for an AGENTS.md (same shape, different filename — ask which)
- User has a project but no CLAUDE.md and wants one
- User has a CLAUDE.md they want to redo from scratch

## When NOT to Use

- User wants to *edit* an existing CLAUDE.md surgically → just edit it, don't run the full interview
- User wants a tiered, full-codebase AGENTS.md across many directories → use the `intent-layer-capture` skill instead
- User wants project-level CLAUDE.md updates triggered by code changes → that's a hook, not this skill

## Output Location

Write to: **`docs/scratchpad/CLAUDE.md`** (relative to the user's current working directory)

- Confirm the path with the user before writing.
- If `docs/scratchpad/` doesn't exist, create it.
- If a file already exists at that path, ask before overwriting.
- **Do NOT write to the repo root.** The user moves the file when they're satisfied.

## The Workflow

### 1. Scan (read-only, narrow)

Read these if they exist, **only to identify what to ask about** — not to fill in:

- `package.json`, `Gemfile`, `pyproject.toml`, `go.mod`, `Cargo.toml` (any one that's present)
- Top-level directory listing (just names, not contents)
- `README.md` (skim, do not summarize into the CLAUDE.md)
- Existing `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md` — if any exist, mention them and ask whether to merge or start fresh

State what you found in one or two sentences. Example: *"Saw a Next.js + Drizzle setup with a `lib/` directory and no existing CLAUDE.md. I won't assume anything about your conventions — I'll ask."*

### 2. Interview

Walk through the 8 sections **one at a time, in order**, using the scripts in `references/interview-questions.md`:

1. Header paragraph
2. Stack
3. Commands
4. Architecture (only what isn't obvious)
5. Conventions
6. Hard constraints
7. Pointers to deeper docs
8. Gotchas (tribal knowledge)

For each section:
- Ask the question(s) from the reference.
- Always offer "skip" as a valid answer.
- If the user gives content, **echo your paraphrase back before recording it.**
- If the user says "skip" or "I don't know" or "nothing interesting there," **stub the section** — do not pad it.

**Do not** batch all questions into one big message. The user's attention is the bottleneck; one section per turn.

### 3. Write

Use `templates/claude-md-stub.md` as the base. Fill in confirmed content. Leave every skipped section as the original `<!-- TODO: ... -->` stub from the template — do not delete the stubs, they help future-you know what was deliberately left blank.

Write to `docs/scratchpad/CLAUDE.md` after confirming the path.

### 4. Close

Tell the user:
- The path you wrote
- Which sections are filled vs stubbed
- "Move it to the repo root when you're happy with it. Claude Code auto-loads `CLAUDE.md` at the root of any project."

No marketing flourishes. No "Now your project is well-documented!" Just the facts.

## The One-Shot Example

`references/postlane-example.md` contains a complete, real-world CLAUDE.md.

**Use it to calibrate**:
- The *tone* (terse, opinionated, every assertion has a *because*)
- The *shape* of each section (what kinds of facts go where)
- The *discipline* (nothing derivable from the codebase appears in the file)

**Do NOT use it to**:
- Pre-fill the user's file with Postlane's choices
- Copy any specific tech, command, gotcha, or PR reference
- Suggest the user "should" have any specific section filled — they shouldn't if they have nothing real to put there

When showing the example to the user, frame it as: *"This is what a fully-filled-in version looks like. Yours will be shorter — most projects don't have this much tribal knowledge to document yet, and that's correct."*

## Rationalizations to Resist

| Rationalization | Reality |
|---|---|
| "Their package.json clearly shows Next.js — I'll just write that." | If Next.js choice has no *story*, it doesn't belong in Stack. Ask first. |
| "Most projects use Prettier, I'll add a convention for it." | Most projects ≠ this project. Ask. |
| "They didn't answer for Hard Constraints, but every project has some — let me suggest a few." | An empty stub is correct. Invented constraints are worse than no constraints. |
| "The Gotchas section feels empty, let me add some 'common Next.js gotchas.'" | Gotchas are bug-fix archaeology specific to *this* project. Generic gotchas are noise. |
| "I'll write 'good code quality' under Conventions as a placeholder." | Vague conventions are worse than no conventions. Stub it. |
| "They said skip but I can tell from the repo that X is true." | Skip means skip. The user knows their project; if they skipped, it's because there's nothing non-obvious to say. |
| "The example has 8 filled sections, theirs should too." | The example is for a mature, scarred-by-production codebase. A new project might fill 2 sections. That's correct. |

## Red Flags — Stop and Recheck

If you find yourself:
- Reading the codebase to *infer* content for the file (vs. to identify questions)
- Suggesting wording before asking the question
- Filling a section because it "looks empty"
- Copying any specific Postlane content
- Telling the user a stubbed section is "incomplete"

**Stop.** You've drifted into assumption. Re-ask the user; if they say skip, stub it.

## Files

- `references/postlane-example.md` — the one-shot, with framing for what to copy (structure, voice) vs. not copy (specifics)
- `references/interview-questions.md` — section-by-section question scripts
- `templates/claude-md-stub.md` — the empty template with TODO comments for each section
