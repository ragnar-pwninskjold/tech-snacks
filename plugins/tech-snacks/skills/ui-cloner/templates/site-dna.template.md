# Site DNA — [Site Name] ([URL])

AUDIT_MODE: [standard | high-fidelity]

---

## 1.1 — PAGE ARCHITECTURE

Total viewport sections: [N]
Section-identification strategy used: [<section> tags | top-level divs under <main>/<body>/framework root]

```
╔══════════════════════════════════════════════════════╗
║  SECTION 1: [Name]                    HEIGHT: [100vh/auto/Xpx]  ║
║  BG: [solid #hex / gradient / image+overlay]         ║
║  LAYOUT: [full-bleed / max-w-Xpx centered / asymmetric] ║
╠══════════════════════════════════════════════════════╣
║  SECTION 2: [Name]                    HEIGHT: [...]  ║
║  BG: [...]                                           ║
║  LAYOUT: [...]                                       ║
╠══════════════════════════════════════════════════════╣
[... repeat for all sections ...]
╚══════════════════════════════════════════════════════╝
```

OVERLAPPING sections: [list any section boundaries that bleed, negative margins, absolute positioning crossover — or "none"]

---

## 1.2 — DESIGN TOKENS

```
PALETTE:
  [Semantic Name] "[Word Name]":  #XXXXXX / rgb(X,X,X)   → [where used]
  [... all colors ...]

TYPOGRAPHY SCALE:
  [Role]     | Font Family              | Weight | Size          | Tracking    | Line-Height | Style
  ──────────────────────────────────────────────────────────────────────────────────────────
  Display    | [font name]              | [wt]   | clamp(X,Xvw,X)| [em/px]    | [ratio]     | [italic?]
  Heading 1  | [font name]              | [wt]   | [rem]         | [em]        | [ratio]     | normal
  Heading 2  | [font name]              | [wt]   | [rem]         | [em]        | [ratio]     | normal
  Body       | [font name]              | [wt]   | [rem]         | [em]        | [ratio]     | normal
  Label      | [font name]              | [wt]   | [rem]         | [em]        | [ratio]     | uppercase
  Mono/Data  | [font name]              | [wt]   | [rem]         | [em]        | [ratio]     | normal
  ⚑ DRAMA NOTES: [KEY typographic contrast that creates visual impact — preserve this ratio]

SPACING GRID: Base unit = [Xpx]. Scale: [list: 4, 8, 16, 24, 32, 48, 64, 96...]
BORDER RADIUS: [size]: [Xpx/rem] — used on [element type]
               [size]: [Xpx/rem] — used on [element type]
SHADOW SYSTEM: [level]: [full box-shadow value]
TEXTURE: [noise overlay / grain / none — method + opacity]
```

---

## 1.3 — SECTION BLUEPRINTS

(Repeat the block below for EVERY section and every discovered sub-section. Sub-sections use `SECTION [N].[letter]: [NAME]`.)

### SECTION [N]: [NAME]

Height: [value] | BG: [treatment] | Padding: [top Xpx / sides Xpx]
Content max-width: [Xpx or full-bleed]

**INTERNAL ASCII WIREFRAME:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────────────┐  ┌────────────────────────┐  │
│  │  LEFT COLUMN     │  │  RIGHT COLUMN          │  │
│  │  [~X% width]     │  │  [~X% width]           │  │
│  │                  │  │                        │  │
│  │  [element type]  │  │  [element type]        │  │
│  │  [element type]  │  │                        │  │
│  └──────────────────┘  └────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
Layout system: [CSS Grid: Xfr Xfr / Flexbox row / Flexbox col / Absolute]
Gap: [Xpx/rem]
```

**TYPOGRAPHY + CONTENT MAP:**

```
  [element] → "[exact text or placeholder description]" | Style: [Display/H1/Body/Label] | Color: [token name]
  [element] → "[...]" | Style: [...] | Color: [...]
  [CTA/button] → "[label]" | Style: [...] | BG: [...] | Type: [primary/secondary/ghost]
```

---

## 1.3b — COMPOSITION MAPS

(Fill for hero section + any section with a Lottie/SVG/canvas visual centerpiece.)

### COMPOSITION MAP: [Section Name]

Element count: [N] distinct visual objects

```
CENTER:    [primary element — device, illustration, etc.]
           Size: [dimensions], Position: [centered/offset], Z-index: [front]

BEHIND:    [background elements that create depth/spread]
           Count: [N], Arrangement: [fanned/grid/scattered/radial]
           Per-element: size, rotation, blur, opacity, position relative to center

FLANKING:  [side elements at the same visual plane as center]
ABOVE:     [overlapping elements in front of center]
AMBIENT:   [atmospheric effects — gradients, glows, particles, halos]
           Gradient specs: type, direction, color stops with exact values
```

---

## 1.4 — ANIMATION TIMELINES

(Repeat for EVERY animated element.)

```
ANIMATION: [Descriptive Name]
Section: [which section]
Trigger: [page-load / scroll-enter(top Xvh) / hover / click / auto-interval(Xms)]
Library: [GSAP / CSS / Framer / unknown]
TIMELINE:
  t=0ms     [element name]   FROM: opacity:0, transform:translateY(30px)   → no change yet
  t=200ms   [element name]   TO:   opacity:1, transform:translateY(0)      DURATION:600ms  EASING:ease-out
  t=350ms   [element name]   TO:   opacity:1, transform:translateY(0)      DURATION:700ms  EASING:cubic-bezier(...)
PROPERTIES ANIMATED: [opacity / transform / filter / clip-path / color / etc.]
LOOP: [yes/no — if yes, describe loop behavior]
RESET: [does it reset on scroll-out?]
```

---

## 1.5 — MICRO-INTERACTIONS

(Repeat for EACH interactive element.)

```
INTERACTION: [Element Name / Type]
Selector hint: [.class-name or describe location]
STATE         | background              | color      | transform       | box-shadow                    | other
──────────────────────────────────────────────────────────────────────────────────────────────────────────
DEFAULT       | #XXXXXX                 | #XXXXXX    | scale(1)        | none                          | border: 1px solid #XXX
HOVER         | #XXXXXX                 | #XXXXXX    | scale(1.02)     | 0 8px 24px rgba(0,0,0,0.15)   | –
ACTIVE/CLICK  | #XXXXXX                 | #XXXXXX    | scale(0.97)     | none                          | –
FOCUS         | –                       | –          | –               | 0 0 0 3px rgba(X,X,X,0.3)    | –
MECHANISM: [CSS transition / GSAP / pseudo-element slide / etc.]
DURATION: [Xms]  EASING: [value or description]
⚑ SPECIAL BEHAVIOR: [non-obvious trick — e.g., pseudo-element slide, clip-path reveal]
```

---

## 1.6 — STATE MACHINES

(Repeat for EACH cycling/toggling/stateful component.)

```
STATE MACHINE: [Component Name]
Location: Section [N]
Type: [Cycler / Toggle / Sequence / Morphing / Typewriter]
STATES:
  State A: [describe visual state — what's visible, what positions]
  State B: [describe visual state]
  State C: [if applicable]
INITIAL STATE: [A/B/C]
TRANSITION A→B:
  Trigger: [user action / timer(Xms) / scroll position]
  Element 1: [property] animates [from → to] over [Xms] with [easing]
  Element 2: [property] animates [from → to] over [Xms] with [easing / delay: Xms]
  Data logic: [e.g., "array.push(array.shift()) rotates items"]
TRANSITION B→C: [same format]
LOOP: [infinite / user-controlled / N times]
INTERNAL LAYOUT:
  Container: [dimensions, position, overflow]
  Each state element: [dimensions, default position, z-index logic]
```

---

## 1.7 — SCROLL CHOREOGRAPHY MAP

```
Scroll %  │ Viewport Position    │ Event / Animation Trigger
─────────────────────────────────────────────────────────────────────
0%        │ Page load            │ [Hero animations begin]
~X%       │ [element] enters vh  │ [what triggers]
~X%       │ [element] enters vh  │ [what triggers]
[...]
─────────────────────────────────────────────────────────────────────
SCROLL BEHAVIORS:
  Parallax elements: [list elements and their scroll speed multiplier]
  Sticky elements: [which elements, at what scroll position, when they unstick]
  Nav state change: [exact scroll threshold where nav changes appearance]
```

---

## 1.8 — TECHNICAL STACK

```
  Framework: [React/Vue/Svelte/Vanilla — confidence: high/medium/inferred]
  Animation: [GSAP X.X / Framer Motion / CSS only / Anime.js / etc.]
  Scroll:    [GSAP ScrollTrigger / Lenis / Locomotive / native]
  UI Lib:    [Tailwind / CSS Modules / Styled Components / etc.]
  Other:     [any other detected libraries]
```

---

## 1.9 — MOTION PHILOSOPHY + COPY VOICE

```
MOTION PHILOSOPHY:
[3–5 sentence gestalt description]

COPY VOICE PATTERN:
  Tone:          [clinical / warm / bold / philosophical / conversational / provocative]
  Sentence form: [fragments / full sentences / mix — with example]
  Key device:    [contrast/paradox / direct address / aspirational / question-answer / etc.]
  Example pattern: "[quote an actual structural pattern used]"
```
