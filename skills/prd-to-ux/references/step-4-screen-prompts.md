# Step 4 — Screen Prompts Export (required)

Terminal step. For every screen × state enumerated in `02-features-and-states.md`, emit a self-contained prompt block using `templates/screen-prompt.template.md`. Output one markdown file per feature at `04-screen-prompts/<feature-slug>.md`.

## What Goes In Each Prompt

Each prompt block contains six labeled fields (from `templates/screen-prompt.template.md`):

- **What this screen is for** — the user's goal in one sentence.
- **What's visible** — content, hierarchy, key elements, in natural language.
- **What the user can do** — primary action, secondary actions.
- **Feel** — pulled from `03-design-direction.md` if it exists, else described inline from `references/default-design-direction.md`. Natural language only.
- **State context** — e.g., "this is the empty state, no notes yet."
- **Critical affordances** — anything that must survive the rendering tool's interpretation.

## What Is Explicitly Forbidden

Never include any of these in a prompt block:
- Tailwind classes.
- Component names (e.g., `<Button variant="primary">`, `Card`, `Sheet`).
- File paths or import statements.
- lucide, heroicons, or any icon-library references.
- Exact measurements (px, dp, rem, tailwind spacing tokens, pt values).
- Viewport dimensions (e.g., `390×844`, `iPhone 14 baseline`).
- Hex color codes — UNLESS the user explicitly supplied them in `03-design-direction.md`, in which case they may be cited as "brand primary (user-supplied)".
- HTML preview artifacts.
- Component trees.
- Consultant-posture mockup proposals (e.g., "deliver two frames on an artboard").
- Platform-native chrome assumptions (safe-area notches, iOS home indicators) unless the PRD says the app is a native iOS/Android app.
- Stylistic anchors by product name ("Think Bear not MyFitnessPal", "make it like Linear"). Describe the quality; don't name a product.

The output is for tools that bring their own interpretation (Stitch, Figma AI, Pencil, Claude Design). Prescriptive specs defeat the purpose.

## Output Structure

```
04-screen-prompts/
├── <feature-slug-1>.md
├── <feature-slug-2>.md
└── ...
```

Each file groups prompts by screen, then by state. Every state named in `02-features-and-states.md` for that feature gets its own block. Order within a file: screen in the order they appear in the flow narration; within a screen, state order is empty → loading → populated → error → permission-denied → edge cases.

## Writing Each Prompt

Walk one screen × state at a time. Consult:
- `02-features-and-states.md` for what's visible and user actions.
- `01b-ux-philosophy.md` for how the screen expresses the chosen metaphor.
- `03-design-direction.md` (or the default reference) for feel.

Describe — do not prescribe. "The capture input should feel like a fresh page, not a form field" is correct. "Use a full-width input with `border-0` and `text-3xl` font-size" is wrong.

## Final Handoff

After all feature files are written, produce a summary:
- Directory path: `docs/prd-to-ux/<date>-<slug>/04-screen-prompts/`
- Counts: features, screens, states total.
- One-sentence recap of the chosen philosophy (pulled from `01b-ux-philosophy.md`).
- Quick-start: **"Open `04-screen-prompts/<feature>.md`, copy the prompt block for the state you want, paste into Stitch / Figma AI / Pencil / Claude Design."**
- Platform-mismatch note if applicable (e.g., mobile PRD + user plans to use a web-focused tool): suggest specifying platform framing when pasting.

The skill terminates here. It does NOT invoke any rendering tool.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "A Tailwind class would be more precise" | Forbidden. Describe the quality in natural language. |
| "Let me add a component-tree sketch to help the tool" | Forbidden. The tool brings its own component interpretation. |
| "User said 'just do it all in one file'" | One file per feature. States grouped by screen. The structure matters for pasting. |
| "Edge-case state seems minor, skip it" | Every state in Step 2 gets a prompt block in Step 4. No skips. |
| "A hex code from the default palette would be fine" | Only if the USER supplied a hex in Step 3. The default is described in natural language. |
| "Let me also generate an HTML preview" | Rejected scope. Markdown prompt blocks only. |
| "'Make it precise' means add specs, measurements, and accessibility minimums" | No. Precision in this step is conceptual precision — what the screen is FOR, what must survive. Measurements and px values are forbidden regardless of how the user phrases the request. |
| "It's a paste-ready prompt for Figma AI / Stitch, so I should structure it like a design brief (artboards, frames, labeled deliverables)" | The rendering tool brings its own structure. Supply intent only. Do not specify artboards, frames, or deliverable geometry. |
| "Mobile web with a notch means I should mark safe-area aware" | Platform-native chrome (notches, home indicators, safe areas) is an assumption unless the PRD calls for native iOS/Android. Mobile web gets no chrome assumptions. |
| "56pt top bar / 44pt tap targets / 4.5:1 contrast — these are industry standards, they're fine" | Measurements, tap-target dimensions, and contrast ratios are forbidden. Accessibility is an implementation concern for the rendering tool; describing the need ("easy to tap, high contrast") is allowed. Numbers are not. |
| "'Think Bear or iA Writer, not MyFitnessPal' — naming products is faster than describing the vibe" | Do not anchor stylistic direction to product names. Describe the quality (quiet, confident, generous whitespace). Product-name anchors drift as those products redesign and leak component-library assumptions into the output. |
