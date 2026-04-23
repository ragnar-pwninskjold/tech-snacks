# Step 3 — Design Direction (optional)

Ask the user: **"Do you want to specify a design direction, or use the default?"**

- **User provides direction:** Capture mood, personality, tone, inspirations, key principles, must-have affordances. Write to `03-design-direction.md` using `templates/design-direction.template.md`. Vibe, not spec — no hex codes, no dp values, no prescriptive component specs unless the user explicitly supplies them (in which case record as plain descriptions, e.g., "brand primary: deep forest green").
- **User skips:** Load `references/default-design-direction.md` inline at Step 4. Do NOT write `03-design-direction.md` in this case — the default is not persisted.

## Questions When the User Opts In

One at a time:
1. What mood or personality should this feel like?
2. What tone — calm, playful, editorial, utilitarian, confident, quiet?
3. What apps or sites do you admire, and why each?
4. What principles matter most to you for this product?
5. Any must-have affordances you want preserved regardless of philosophy?

## Phase Gate

If the user opted in, show a one-line summary of the captured direction and confirm before Step 4. If they skipped, just confirm "using default design direction" and proceed.

## Red Flags / Common Rationalizations

| Thought | Reality |
|---|---|
| "User gave me a hex code, I'll put it in the final prompt" | Record it here as a plain description. Step 4 can reference it, but never as a raw hex unless it was explicitly supplied that way. |
| "User skipped — I'll still write `03-design-direction.md` with defaults" | Do not. The default stays in the reference file and is pulled inline at Step 4. |
| "Let me add Tailwind classes since they picked shadcn-ish" | Step 3 is vibe-only. No framework-specific terms. |
