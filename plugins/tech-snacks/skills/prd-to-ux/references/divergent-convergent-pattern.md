# Divergent → Convergent Pattern

This pattern is shared by Step 1 (feature generation from an underspecified idea) and Step 1.5 (UX expression synthesis). The input material differs; the reasoning shape does not.

## The Three Phases

### 1. Diverge
Generate ~10 candidates. Aim for real variety — different organizing assumptions, different mental models, different axes of emphasis. Do not self-filter yet. Quantity enables later quality; 3 candidates is not divergence.

Hard-coded to ~10 initially. A future `divergence_count` knob is a one-line change — do not add it now.

### 2. Adversarial filter
Walk the candidates and cull:
- **Cargo-culted** — borrowed from similar products without being right for this PRD.
- **Redundant** — duplicates another candidate in substance if not label.
- **Off-brief** — violates stated target audience, platform, or Non-Goals / Anti-Goals.
- **Shallow** — a name without a working mental model behind it.

Filtering is internal to the agent's reasoning. The user does NOT see the full 10. They see the survivors with reasoning.

### 3. Converge / Crystallize
Present a small number (Step 1: the surviving candidate features; Step 1.5: synthesize surviving expressions into exactly 3 philosophies). Each surviving option carries: a name, a one-sentence mental model, and honest trade-offs.

The skill NEVER auto-selects. The user chooses, asks for a hybrid, or asks for regeneration.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "The user seems decisive, I'll just pick one" | The skill does not auto-select. Always present options. |
| "10 is too many, I'll do 4" | Divergence requires breadth. 10 is the floor. |
| "All 10 are good, why filter?" | Filtering surfaces reasoning the user would lose if we just listed them. |
| "I'll skip trade-offs, they slow things down" | Trade-offs are the whole point of the convergent phase. |
| "The user rejected all 3, let me just pick one" | Re-diverge on a different axis, or ask what axis was wrong. Do not force a choice. |

## Inputs by Caller

- **Step 1 (features):** raw idea + MVP sketch → 10 candidate features → filter → present survivors for user confirmation.
- **Step 1.5 (UX philosophies):** locked PRD feature set → 10 UX expressions / organizing metaphors → filter → synthesize into 3 coherent philosophies → user picks.
