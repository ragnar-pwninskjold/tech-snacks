# Replication Prompt — [Project Name]

---

## 1. ROLE + AESTHETIC IDENTITY

**Role:** Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer.

**Aesthetic Identity:** [5–8 word poetic description of the site's soul]

---

## 2. CORE DESIGN SYSTEM

### Palette

| Semantic Name | Descriptive Word | Hex | Usage |
|---|---|---|---|
| Primary | [word] | #XXXXXX | [roles/contexts] |
| Accent | [word] | #XXXXXX | [roles/contexts] |
| Background | [word] | #XXXXXX | [roles/contexts] |
| [additional roles] | [word] | #XXXXXX | [roles/contexts] |

### Typography

| Role | Font Family | Weight | Size | Line-Height | Notes |
|---|---|---|---|---|---|
| Display | [family] | [weight] | [size] | [lh] | [italic rules, special use] |
| Heading | [family] | [weight] | [size] | [lh] | |
| Body | [family] | [weight] | [size] | [lh] | |
| Label | [family] | [weight] | [size] | [lh] | [uppercase, tracking] |

**⚑ Drama Ratio:** [preserve from Site DNA Step 1.2 — the key typographic contrast]

### Texture System

- Noise/grain: [method + opacity]
- Border radius scale: [values + usage]
- Shadow system: [levels + values]

---

## 3. COMPONENT ARCHITECTURE

(Section-by-section. For High-Fidelity mode, embed the Site DNA's ASCII wireframes, animation timelines, state machines, and property diff tables verbatim — with user's content and palette substituted. For Standard mode, use pseudocode-level descriptions.)

### [Section 1 Name] — "The [Poetic Component Name]"

[Embedded wireframe / behavior spec / animation timeline / state machine]

### [Section 2 Name] — "The [Poetic Component Name]"

[...]

### [Repeat for all sections]

---

## 4. TECHNICAL REQUIREMENTS

```
TECHNICAL REQUIREMENTS
  Stack:                [framework, language, component library]
  Animation:            [library + version, e.g., GSAP 3.12]
  Scroll:               [scroll library, e.g., GSAP ScrollTrigger / Lenis]
  Animation Lifecycle:  [e.g., "Use gsap.context() scoped to component ref inside useEffect; return context.revert() on cleanup"]
  Scroll Trigger Setup: [e.g., "Register ScrollTrigger plugin. trigger:'[selector]', start:'top 80%', end:'top 20%', scrub:true for parallax"]
  Hover Implementation: [exact pseudo-element or transition mechanism]
  Custom Cursor:        [behavior + implementation, or N/A]
  Font Loading:         [e.g., "Load via Google Fonts: [families + weights]"]
  Image Sources:        [real Unsplash URLs matching aesthetic, or user-provided references — no placeholders]
```

---

## 5. EXECUTION DIRECTIVE

*[Single philosophical sentence — how to FEEL while building, not what to build.]*
