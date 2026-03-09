---
name: ui-cloner-forensic-audit
description: Use when performing a forensic analysis of a target website as part of the UI cloning pipeline. Phase 1 of SRIP — runs steps 1.1 through 1.9 and produces a Site DNA document.
---

# UI Cloner — Phase 1: Forensic Site Audit

## Overview

Analyze the target URL with clinical precision across 9 audit steps. The output is a structured **Site DNA** document that captures every design token, motion pattern, and interaction behavior.

**Announce:** "Running Phase 1 — Forensic Site Audit on [URL] in [Standard / High-Fidelity] Mode."

**Read the `AUDIT_MODE` flag** from `plans/01-site-dna.md` (set by the entry skill). If `AUDIT_MODE: high-fidelity`, use the **High-Fidelity** output formats below for every step. If `AUDIT_MODE: standard`, use the **Standard** output formats.

---

## Anti-Flattening Doctrine (Applies to EVERY step)

Flattening is the #1 fidelity killer. Flattening means reducing a rich visual, typographic, layout, or motion detail into a vague summary. Every time you write a description, ask: "Could a developer build this from ONLY what I wrote?" If the answer is no, you have flattened.

Examples of flattening (BANNED):
- "Large Lottie animation showing phone mockup" → LOST: the 4-5 blurred cards fanned behind the phone
- "Warm color palette" → LOST: the exact hex codes, where each is used, the hierarchy
- "Cards stack on scroll" → LOST: sticky top values, shadow treatment, z-index behavior
- "Text animates in" → LOST: per-word vs per-line, stagger timing, easing curve, delay
- "Shows app interface" → LOST: what screens, what layout, what content is visible

The correct approach: describe EVERY visual element, EVERY value, EVERY relationship. If a composition has 5 elements, describe all 5. If a color appears in 3 roles, list all 3. If an animation has 4 stages, document all 4. More detail is ALWAYS better than less. The synthesis phase can trim — but it cannot recover what you never captured.

---

## Step 1.1 — Macro Page Architecture

**⚠ SECTION IDENTIFICATION (RUN FIRST):** Not all sites use `<section>` tags. Before documenting architecture, determine the site's structural pattern by running:

```javascript
// Detect top-level page structure
const sections = document.querySelectorAll('body > section, main > section, [role="main"] > section');
const topDivs = document.querySelectorAll('body > div, main > div, [role="main"] > div, #__next > div > div, #app > div > div');
console.log('Section tags found:', sections.length);
console.log('Top-level divs found:', topDivs.length);

// Identify visual sections by finding distinct content blocks
// (elements with significant height that represent page "sections" regardless of tag)
const candidates = sections.length >= 3 ? sections : topDivs;
Array.from(candidates).forEach((el, i) => {
  if (el.offsetHeight > 100) {
    const bg = getComputedStyle(el).backgroundColor;
    console.log(i, el.tagName + '.' + el.className.substring(0,50), el.offsetHeight + 'px', 'bg:' + bg);
  }
});
```

Use `<section>` tags as section boundaries if the site has 3+ of them. Otherwise, treat top-level `<div>` children of `<main>`, `<body>`, or the framework root (`#__next > div`, `#app > div`, etc.) as the section boundaries. Document which strategy you used at the top of the architecture block. In all subsequent steps, "section" refers to whichever structural unit you identified here — not necessarily a `<section>` HTML tag.

**Standard:** Document total section count, grid philosophy (full-bleed? constrained? asymmetric?), whitespace rhythm, section stacking logic, and approximate aspect ratios.

**High-Fidelity:** Produce a vertical ASCII wireframe of the ENTIRE page:

```
PAGE ARCHITECTURE: [Site Name] — [URL]
Total viewport sections: [N]
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

Note any OVERLAPPING sections (negative margins, absolute positioning bleeding between sections).

**⚠ TALL SECTION SCROLL MANDATE:** For any section with height > 2000px, you MUST:
1. Count ALL direct children of the deepest content container (not just the first few)
2. Scroll through the section in ~500px increments, taking a screenshot at each stop
3. Document every distinct component found — components at the END of a tall section are the most likely to be missed
4. Never assume a section contains only one type of component based on the first few children

---

## Step 1.2 — Design Token Extraction

**Standard:** Extract hex/rgba for body background, primary headings, buttons, links, accent elements. Name semantically. Extract font-family, font-weight, font-size, letter-spacing, line-height for h1–h3, body, labels. Document spacing grid, border-radius, shadow system.

**High-Fidelity:** Use DevTools Computed Styles panel. Run in console:

```javascript
// Color sweep:
const allElements = document.querySelectorAll('*');
const colors = new Set();
allElements.forEach(el => {
  const s = getComputedStyle(el);
  ['color','backgroundColor','borderColor','fill','stroke'].forEach(p => {
    const v = s[p]; if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') colors.add(v);
  });
});
console.log([...colors].join('\n'));
// Font detection:
const fonts = new Set();
allElements.forEach(el => fonts.add(getComputedStyle(el).fontFamily));
console.log([...fonts].join('\n'));
```

Produce this structured token document:

```
DESIGN TOKENS
─────────────────────────────────────────────────────
PALETTE:
  [Semantic Name] "[Word Name]":  #XXXXXX / rgb(X,X,X)   → [where used: e.g., "section backgrounds, card fills"]
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
  ⚑ DRAMA NOTES: [Describe the KEY typographic contrast that creates visual impact. e.g., "The juxtaposition of 800-weight sans at 3rem with 300-weight serif italic at 9rem IS the hero's drama. Do not lose this ratio."]

SPACING GRID: Base unit = [Xpx]. Scale: [list: 4, 8, 16, 24, 32, 48, 64, 96...]
BORDER RADIUS: [size]: [Xpx/rem] — used on [element type]
               [size]: [Xpx/rem] — used on [element type]
SHADOW SYSTEM: [level]: [full box-shadow value]
TEXTURE: [noise overlay / grain / none — method + opacity]
─────────────────────────────────────────────────────
```

---

## Step 1.3 — Section Blueprints (Repeat for EVERY section)

**Standard:** For each section document: background treatment, image/filter effects, gradient directions and stop values, glass/frosted effects.

**⚠ SUB-SECTION DISCOVERY (MANDATORY — DO NOT SKIP):** After identifying the primary layout pattern of each section, you MUST enumerate ALL direct children at EVERY nesting level down to the first content container. The goal is to catch **mixed component types** sharing a parent — e.g., 3 cards with class `.card` plus a 4th sibling with class `.map_stats` that has a completely different layout. These mismatched siblings are the #1 source of missed components.

**Why this matters:** Sites frequently nest visually distinct content blocks (maps, stats panels, secondary CTAs, media embeds, spacers) as siblings alongside repeating components. They won't share the repeating component's class name, so querying by a specific class (e.g., `.card`) will miss them. You MUST query by **parent children**, not by **component class**.

**Procedure for EVERY section:**

1. Find the section's deepest content-holding container (the element whose direct children ARE the visual components)
2. Enumerate ALL children of that container — not just the ones matching an expected pattern
3. For EACH child, log: index, tagName, className, offsetHeight, position, top, and first 80 chars of textContent
4. If any child has a **different class name** from the majority, a **different height** (>30% deviation), or **different position** value — flag it as a potential sub-section and investigate fully
5. If the section height is >2x viewport (>2000px), you MUST scroll through its FULL height taking screenshots at intervals to catch components only visible mid-scroll

Run this console snippet per section (replace SECTION_SELECTOR):

```javascript
// EXHAUSTIVE child enumeration — catches mixed component types
const sec = document.querySelector('SECTION_SELECTOR');
// Drill down to the content container: try multiple nesting depths
let wrapper = sec;
for (let d = 0; d < 5; d++) {
  const children = Array.from(wrapper.children).filter(c => c.offsetHeight > 50);
  if (children.length >= 2) break; // Found the level with multiple content children
  if (children.length === 1) { wrapper = children[0]; continue; }
  break;
}
// Now enumerate ALL children — DO NOT filter by class name
const classCount = {};
Array.from(wrapper.children).forEach((child, i) => {
  const cls = child.className.split(' ')[0] || 'no-class';
  classCount[cls] = (classCount[cls] || 0) + 1;
  const s = getComputedStyle(child);
  console.log(
    'CHILD[' + i + ']',
    child.tagName + '.' + child.className.substring(0,50),
    'H:' + child.offsetHeight + 'px',
    'pos:' + s.position,
    'top:' + s.top,
    'bg:' + s.backgroundColor,
    '"' + child.textContent.trim().substring(0,60) + '"'
  );
});
// Flag orphans — children whose class appears only once (likely different component type)
Object.entries(classCount).forEach(([cls, count]) => {
  if (count === 1) console.log('⚠ ORPHAN CLASS (appears once): ' + cls + ' — investigate as potential sub-section');
});
```

If ANY orphan classes are found, or if any child has height >30% different from siblings, you MUST create a full wireframe and content map for that child as a named **SUB-SECTION** using the format `SECTION [N].[letter]: [NAME]`.

**High-Fidelity:** For each section (and each discovered sub-section) produce TWO outputs:

**A) INTERNAL ASCII WIREFRAME:**

```
SECTION [N]: [NAME]
Height: [value] | BG: [treatment] | Padding: [top Xpx / sides Xpx]
Content max-width: [Xpx or full-bleed]
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

**B) TYPOGRAPHY + CONTENT MAP:**

```
CONTENT MAP: Section [N]
  [element] → "[exact text or placeholder description]" | Style: [Display/H1/Body/Label] | Color: [token name]
  [element] → "[...]" | Style: [...] | Color: [...]
  [CTA/button] → "[label]" | Style: [...] | BG: [...] | Type: [primary/secondary/ghost]
```

---

## Step 1.3b — Visual Composition Inventory (MANDATORY for Hero + Key Visual Sections)

**Why this exists:** Hero sections and visual centerpieces often contain their most distinctive design elements inside opaque media — Lottie animations, inline SVGs, canvas elements, or background images. These elements are INVISIBLE to DOM queries. A Lottie is one `<svg>` node in the DOM, but it may render a complex composition of 10+ visual elements. If you describe a Lottie as "shows phone mockup with app UI," you have destroyed the design.

**Trigger:** Run this step for:
- The hero section (always)
- Any section with a Lottie, canvas, or large inline SVG as its visual centerpiece
- Any section where a single DOM element renders a complex visual scene

**Procedure:**

1. Take a full-viewport screenshot of the section at its most visually complete state
2. Identify EVERY distinct visual element in the composition — count them
3. Produce a **COMPOSITION MAP** using this format:

```
COMPOSITION MAP: [Section Name]
Element count: [N] distinct visual objects

CENTER:    [primary element — device, illustration, etc.]
           Size: [dimensions], Position: [centered/offset], Z-index: [front]

BEHIND:    [background elements that create depth/spread]
           Count: [N], Arrangement: [fanned/grid/scattered/radial]
           Per-element: size, rotation, blur, opacity, position relative to center
           Example: "4 app screenshot cards, 240x380px each, fanned in radial arc
                     at -8deg/-4deg/+4deg/+8deg, blur(2px), opacity 0.25-0.3,
                     positioned 60-120px from center"

FLANKING:  [side elements at the same visual plane as center]
ABOVE:     [overlapping elements in front of center]
AMBIENT:   [atmospheric effects — gradients, glows, particles, halos]
           Gradient specs: type, direction, color stops with exact values
```

4. For Lottie/SVG/canvas elements specifically:
   - You CANNOT inspect internals via DOM queries — rely on the screenshot
   - Describe the INITIAL rendered frame AND the animated state (if different)
   - Count every distinct visual object: devices, cards, shapes, icons, text blocks
   - Note spatial relationships: what overlaps what, what's in front/behind
   - Note visual treatments per element: blur amount, opacity, rotation angle, scale

5. NEVER reduce a multi-element composition to a single-line description. If you see a phone with cards behind it, you must describe the phone AND every card.

**Anti-Flattening Check:** Before moving to the next step, re-read your composition map and ask: "If I handed this to an illustrator who has never seen the site, could they recreate this composition?" If not, add more detail.

---

## Step 1.4 — Scroll & Entrance Animation Audit

**Standard:** Scroll slowly top to bottom. For each animation record: trigger type, target element, animation type (fade-up/scale-in/clip-reveal/etc.), duration estimate, easing feel, stagger offset.

**High-Fidelity:** Use this exact timeline format for EVERY animated element:

```
ANIMATION: [Descriptive Name]
Section: [which section]
Trigger: [page-load / scroll-enter(top Xvh) / hover / click / auto-interval(Xms)]
Library: [GSAP / CSS / Framer / unknown]
TIMELINE:
  t=0ms     [element name]   FROM: opacity:0, transform:translateY(30px)   → no change yet
  t=200ms   [element name]   TO:   opacity:1, transform:translateY(0)      DURATION:600ms  EASING:ease-out
  t=350ms   [element name]   TO:   opacity:1, transform:translateY(0)      DURATION:700ms  EASING:cubic-bezier(0.34,1.56,0.64,1)
PROPERTIES ANIMATED: [opacity / transform / filter / clip-path / color / etc.]
LOOP: [yes/no — if yes, describe loop behavior]
RESET: [does it reset on scroll-out?]
```

To find exact easing values: Elements panel → select animated element → Animations tab. Or console: `getComputedStyle(document.querySelector('[selector]')).transition`

**OPAQUE MEDIA DECOMPOSITION (Lottie / SVG / Canvas):**
When an animation is rendered by Lottie, complex SVG, or canvas — you cannot read its internals from the DOM. Do NOT describe it as a single unit. Instead:
1. Take a screenshot of its rendered state
2. Cross-reference with your Step 1.3b Composition Map
3. Document what the animation DOES to each element in the composition (not just "Lottie plays")
4. If the Lottie animates elements into position (e.g., cards fan out, phone scales up), describe the before and after states of EACH element

---

## Step 1.5 — Micro-Interaction Catalog

**Standard:** Hover every interactive element. Document: nav hover states, button hover, card hover, custom cursor behavior, form focus states.

**High-Fidelity:** For each interactive element, produce a property diff table:

```
INTERACTION: [Element Name / Type]
Selector hint: [.class-name or describe location]
STATE         | background              | color      | transform       | box-shadow                    | other
──────────────────────────────────────────────────────────────────────────────────────────────────────────
DEFAULT       | #XXXXXX                 | #XXXXXX    | scale(1)        | none                          | border: 1px solid #XXX
HOVER         | #XXXXXX (slide from L)  | #XXXXXX    | scale(1.02)     | 0 8px 24px rgba(0,0,0,0.15)   | –
ACTIVE/CLICK  | #XXXXXX                 | #XXXXXX    | scale(0.97)     | none                          | –
FOCUS         | –                       | –          | –               | 0 0 0 3px rgba(X,X,X,0.3)    | –
MECHANISM: [CSS transition / GSAP / pseudo-element slide / etc.]
DURATION: [Xms]  EASING: [value or description]
⚑ SPECIAL BEHAVIOR: [e.g., "overflow:hidden with ::before pseudo-element translating from -100% to 0 creates the background slide effect — NOT a color transition"]
```

---

## Step 1.6 — Component Behavior Deep-Dive

**Standard:** Document stateful/interactive components: carousels, accordions, tab systems, sticky elements, nav morphing, typewriter effects, number animations, cursor-following effects.

**High-Fidelity:** For any component that cycles, toggles, or has internal state:

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
  Data logic: [e.g., "array.push(array.shift()) rotates items", "currentIndex = (currentIndex + 1) % items.length"]
TRANSITION B→C: [same format]
LOOP: [infinite / user-controlled / N times]
INTERNAL LAYOUT:
  Container: [dimensions, position, overflow]
  Each state element: [dimensions, default position, z-index logic]
```

---

## Step 1.7 — Scroll Choreography Map

**Standard:** Note parallax elements and their approximate scroll speed, sticky element thresholds, and nav state change trigger point.

**High-Fidelity:** After scrolling the entire page, produce this scroll position → event map:

```
SCROLL CHOREOGRAPHY MAP
─────────────────────────────────────────────────────────────────────
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

## Step 1.8 — Technical Stack Detection

**Standard:** Run basic stack detection in browser console. Check `<script>` tags for CDN links. Note Tailwind class patterns or CSS Modules naming.

**High-Fidelity:** Run in DevTools console:

```javascript
const stack = {
  gsap: typeof gsap !== 'undefined' ? gsap.version : false,
  framerMotion: !!document.querySelector('[data-framer-component-type]'),
  threeJS: typeof THREE !== 'undefined',
  react: !!(document.querySelector('[data-reactroot]') || window.__REACT_DEVTOOLS_GLOBAL_HOOK__),
  vue: !!document.querySelector('[data-v-app]'),
  alpine: typeof Alpine !== 'undefined',
  lenis: typeof Lenis !== 'undefined' || typeof lenis !== 'undefined',
  locomotive: !!document.querySelector('[data-scroll-container]'),
  tailwind: !!document.querySelector('[class*="flex-"]') || !!document.querySelector('[class*="text-"]'),
};
console.table(stack);
document.querySelectorAll('script[src]').forEach(s => {
  if (s.src.match(/gsap|framer|lottie|three|swiper|aos|scrollmagic|anime/i))
    console.log('Library detected:', s.src);
});
```

Document findings:

```
TECHNICAL STACK
  Framework: [React/Vue/Svelte/Vanilla — confidence: high/medium/inferred]
  Animation: [GSAP X.X / Framer Motion / CSS only / Anime.js / etc.]
  Scroll:    [GSAP ScrollTrigger / Lenis / Locomotive / native]
  UI Lib:    [Tailwind / CSS Modules / Styled Components / etc.]
  Other:     [any other detected libraries]
```

---

## Step 1.9 — Motion Philosophy + Copy Voice

**Standard:** Write 3–5 sentences describing the gestalt motion philosophy. Note copy tone, sentence length pattern, rhetorical devices, key structural patterns.

**High-Fidelity:**

```
MOTION PHILOSOPHY:
[3–5 sentence gestalt description. Address: Is the motion physics-based (springy/weighted)?
Cinematic (slow/deliberate)? Functional (fast/subtle)? What emotional state does the motion
PRODUCE in the viewer? What would be lost if all animations were removed?]

COPY VOICE PATTERN:
  Tone:          [clinical / warm / bold / philosophical / conversational / provocative]
  Sentence form: [fragments / full sentences / mix — with example]
  Key device:    [contrast/paradox / direct address / aspirational / question-answer / etc.]
  Example pattern: "[quote an actual structural pattern used, e.g., 'Modern X asks: Y. We ask: Z.']"
```

---

## Output: Site DNA Document

Compile all findings into a structured block titled `## SITE DNA` before proceeding.

**Standard mode:** Format clearly with all extracted values — hex codes, timing estimates, named components, verbatim copy samples.

**High-Fidelity mode:** Every section must include: ASCII wireframe (1.1, 1.3), design token table (1.2), animation timelines with t=Xms notation (1.4), property diff tables (1.5), state machines (1.6), scroll choreography map (1.7), stack table (1.8), motion + copy voice blocks (1.9). No section may use prose where a structured artifact format is specified. Every time you abstract or summarize instead of documenting precisely, fidelity is permanently lost.

**Save output:** Write the full Site DNA (with `AUDIT_MODE` flag at top) to `plans/01-site-dna.md` in the current project directory. Create the `plans/` directory if it doesn't exist.

**When complete:** Invoke **ui-cloner-brand-interview** to begin Phase 2.
