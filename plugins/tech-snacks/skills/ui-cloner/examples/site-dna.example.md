# Site DNA — Example Snippets

Illustrative worked examples for the blocks in `../templates/site-dna.template.md` where abstract field hints alone aren't enough. These are pulled from real forensic audits of hero compositions and typography systems. Use them as the fidelity bar — when your own audit entries feel thinner than these, you are probably flattening.

---

## Composition Map (Step 1.3b) — Worked Example

```
COMPOSITION MAP: Hero Section
Element count: 6 distinct visual objects

CENTER:    iPhone 14 Pro mockup, titanium finish, rendered in 3/4 perspective tilt
           Size: 320×650px, Position: centered horizontally, offset +40px from vertical center
           Z-index: front (z=10)

BEHIND:    4 app screenshot cards
           Count: 4, Arrangement: fanned in radial arc behind phone
           Per-element:
             - Card 1: 240×380px, rotation -8deg, blur(2px), opacity 0.30, offset -120px left of center
             - Card 2: 240×380px, rotation -4deg, blur(2px), opacity 0.28, offset -60px left of center
             - Card 3: 240×380px, rotation +4deg, blur(2px), opacity 0.28, offset +60px right of center
             - Card 4: 240×380px, rotation +8deg, blur(2px), opacity 0.30, offset +120px right of center

FLANKING:  none

ABOVE:     Floating notification badge (pill shape), 180×44px, rests over top-right edge of phone
           Glass-morphism: rgba(255,255,255,0.12) + backdrop-filter: blur(12px)

AMBIENT:   Radial gradient glow behind full composition
           Gradient: radial-gradient(ellipse at 50% 40%, rgba(255,180,120,0.25) 0%, rgba(20,10,10,0) 60%)
           Size: 1200×800px, sits behind all other elements (z=-1)
```

Why this level of detail: a developer handed only "phone with app cards behind it" rebuilds a single phone and 1–2 cards at random positions. Every number above ("240×380px", "-8deg", "opacity 0.30", "backdrop-filter: blur(12px)", the exact radial gradient stops) has to survive into the synthesis prompt or the hero composition collapses.

---

## Typography Drama Note (Step 1.2 ⚑) — Worked Example

```
⚑ DRAMA NOTES: The juxtaposition of 800-weight Plus Jakarta Sans at 3rem (headline)
with 300-weight Cormorant Garamond italic at 9rem (philosophical word inside the
headline) IS the hero's typographic drama. The italic word is ~3× the size of
the surrounding sans headline and sits on a slightly lower baseline, creating a
"quote pulled from a rare book" tension against the clinical sans. Do not lose
this ratio, the weight contrast, or the italic/roman contrast. If the ratio
drops below 2.5× or the italic is swapped for roman, the hero's soul is gone.
```

Why this level of detail: synthesis is tempted to compress this to "large serif italic accent word." That compression loses the 3× ratio, the 800-vs-300 weight contrast, and the baseline offset — three distinct design decisions, all of which have to survive.

---

## Micro-Interaction Special Behavior (Step 1.5 ⚑) — Worked Example

```
⚑ SPECIAL BEHAVIOR: Button background is NOT a color transition. The visible
background is a ::before pseudo-element positioned absolutely, width: 100%,
height: 100%, initially translateX(-100%). On hover, translateX(0) over 300ms
with cubic-bezier(0.65, 0, 0.35, 1). The button itself has overflow: hidden.
This creates a "wipe in from left" effect, NOT a fade or color crossfade.
Implementing this as a CSS `background-color` transition will produce a
visually WRONG result even with identical colors and duration.
```

Why this level of detail: the synthesis prompt must name the mechanism, not just describe the visible effect. "Smooth color transition on hover" leads to a background-color transition that does not match the reference. "Pseudo-element wipe from left" leads to the correct implementation.
