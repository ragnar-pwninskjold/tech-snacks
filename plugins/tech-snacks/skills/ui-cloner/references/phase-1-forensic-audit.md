# UI Cloner — Phase 1: Forensic Site Audit

## Overview

Analyze the target URL with clinical precision across 9 audit steps. The output is a structured **Site DNA** document that captures every design token, motion pattern, and interaction behavior.

**Announce:** "Running Phase 1 — Forensic Site Audit on [URL] in [Standard / High-Fidelity] Mode."

**Read the `AUDIT_MODE` flag** from `plans/01-site-dna.md` (set by the orchestrator). If `AUDIT_MODE: high-fidelity`, use the **High-Fidelity** output formats below for every step. If `AUDIT_MODE: standard`, use the **Standard** output formats.

The overall shape of the output artifact lives in `../templates/site-dna.template.md`. Fill that scaffold as you complete each step.

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

**High-Fidelity:** Produce a vertical ASCII wireframe of the ENTIRE page. Use the `PAGE ARCHITECTURE` block scaffold in `../templates/site-dna.template.md`.

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

Fill the `DESIGN TOKENS` block in `../templates/site-dna.template.md` with every captured value.

The `⚑ DRAMA NOTES` field under TYPOGRAPHY SCALE is mandatory in HF mode — describe the KEY typographic contrast that creates visual impact (e.g., "The juxtaposition of 800-weight sans at 3rem with 300-weight serif italic at 9rem IS the hero's drama. Do not lose this ratio."). This ratio is the single highest-leverage detail to preserve through synthesis.

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

**High-Fidelity:** For each section (and each discovered sub-section) produce both an INTERNAL ASCII WIREFRAME and a TYPOGRAPHY + CONTENT MAP using the `SECTION BLUEPRINT` block scaffold in `../templates/site-dna.template.md`.

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
3. Fill a **COMPOSITION MAP** using the block scaffold in `../templates/site-dna.template.md`. For a worked example of the level of detail required, see `../examples/site-dna.example.md` (Composition Map section) — specifically the treatment of element count, per-element blur/opacity/rotation, and spatial relationships.

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

**High-Fidelity:** Use the `ANIMATION TIMELINE` block scaffold in `../templates/site-dna.template.md` for EVERY animated element. Every timeline entry must include `t=Xms` notation, FROM → TO property values, duration, and easing.

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

**High-Fidelity:** For each interactive element, produce a property diff table using the `INTERACTION` block scaffold in `../templates/site-dna.template.md` — DEFAULT / HOVER / ACTIVE / FOCUS rows, with background, color, transform, box-shadow, and other columns. Always document the MECHANISM (pseudo-element slide? color transition? clip-path?) and `⚑ SPECIAL BEHAVIOR` note for non-obvious tricks (e.g., "overflow:hidden with ::before pseudo-element translating from -100% to 0 creates the background slide effect — NOT a color transition").

---

## Step 1.6 — Component Behavior Deep-Dive

**Standard:** Document stateful/interactive components: carousels, accordions, tab systems, sticky elements, nav morphing, typewriter effects, number animations, cursor-following effects.

**High-Fidelity:** For any component that cycles, toggles, or has internal state, fill a `STATE MACHINE` block (scaffold in `../templates/site-dna.template.md`). Include: all states, initial state, transitions A→B / B→C with per-element animation specs and data logic (e.g., `array.push(array.shift())` rotation, `currentIndex = (currentIndex + 1) % items.length`), loop behavior, and internal layout specifics.

---

## Step 1.7 — Scroll Choreography Map

**Standard:** Note parallax elements and their approximate scroll speed, sticky element thresholds, and nav state change trigger point.

**High-Fidelity:** After scrolling the entire page, fill the `SCROLL CHOREOGRAPHY MAP` block (scaffold in `../templates/site-dna.template.md`) with scroll % → viewport position → event/animation trigger rows, plus dedicated notes for parallax multipliers, sticky thresholds, and nav state-change scroll position.

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

Fill the `TECHNICAL STACK` block in `../templates/site-dna.template.md` with findings: framework (+ confidence), animation library (+ version), scroll library, UI lib, other.

---

## Step 1.9 — Motion Philosophy + Copy Voice

**Standard:** Write 3–5 sentences describing the gestalt motion philosophy. Note copy tone, sentence length pattern, rhetorical devices, key structural patterns.

**High-Fidelity:** Fill the `MOTION PHILOSOPHY` and `COPY VOICE PATTERN` blocks in `../templates/site-dna.template.md`.

For **motion philosophy**: 3–5 sentence gestalt. Address: physics-based (springy/weighted)? Cinematic (slow/deliberate)? Functional (fast/subtle)? What emotional state does the motion PRODUCE in the viewer? What would be lost if all animations were removed?

For **copy voice**: tone, sentence form, key rhetorical device, and quote an actual structural pattern used (e.g., "Modern X asks: Y. We ask: Z.").

---

## Output: Site DNA Document

Compile all findings into a structured block titled `## SITE DNA` following `../templates/site-dna.template.md`.

**Standard mode:** Format clearly with all extracted values — hex codes, timing estimates, named components, verbatim copy samples.

**High-Fidelity mode:** Every section must include: ASCII wireframe (1.1, 1.3), design token table (1.2), animation timelines with t=Xms notation (1.4), property diff tables (1.5), state machines (1.6), scroll choreography map (1.7), stack table (1.8), motion + copy voice blocks (1.9). No section may use prose where a structured artifact format is specified. Every time you abstract or summarize instead of documenting precisely, fidelity is permanently lost.

**Save output:** Write the full Site DNA (with `AUDIT_MODE` flag at top) to `plans/01-site-dna.md` in the current project directory. Create the `plans/` directory if it doesn't exist.

**When complete:** Return control to the orchestrator (`../SKILL.md`) to proceed with Phase 2.
