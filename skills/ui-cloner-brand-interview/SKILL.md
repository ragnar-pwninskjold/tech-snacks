---
name: ui-cloner-brand-interview
description: Use when Phase 1 forensic audit is complete and it's time to collect brand information from the user. Phase 2 of SRIP — presents all 12 brand questions in a single message and waits for answers before proceeding.
---

# UI Cloner — Phase 2: Brand Interview

## Overview

After completing the Site DNA, present ALL 12 questions to the user in a **single message**. Do not proceed to synthesis until you have their answers to all 12.

**Announce:** "Phase 1 complete. Moving to Phase 2 — Brand Interview."

**Critical rule:** Ask all 12 questions at once. Do not drip them one at a time.

---

## The Interview Block

Present this exact block verbatim:

---

I've completed a forensic analysis of the reference site. Before I generate your custom replication prompt, I need to understand your brand and goals. Please answer all 12 questions below — be as specific as possible, as each answer directly shapes the output.

**1. PRODUCT IDENTITY**
What is your product or service in one clear sentence? What industry/category does it live in?

**2. AUDIENCE PERSONA**
Who is your primary target user? Describe their age range, technical sophistication, and one psychographic trait (e.g., "ambitious but time-poor", "skeptical but curious", "aspirational early adopter").

**3. BRAND FEELING**
List exactly 3 adjectives that describe how you want the site to FEEL when someone lands on it. (Examples: "cinematic, clinical, trustworthy" / "playful, warm, bold" / "minimal, precise, premium")

**4. COLOR PALETTE**
Do you have existing brand colors? Provide hex codes if yes. If no, describe the emotional palette you want — or name colors/brands/objects that capture the vibe (e.g., "dark forest + warm terracotta + cream paper").

**5. PAGE SECTIONS**
List every section you want on the page in order. Choose from or add to: Hero, Problem Statement, Features/Benefits, How It Works, Social Proof/Testimonials, Pricing, About/Manifesto, FAQ, CTA Banner, Footer.

**6. PRIMARY HEADLINE**
What is your primary hero headline? (Can be a rough draft.) What's the 1-sentence subheadline?

**7. PRIMARY CTA**
What is the #1 action you want visitors to take? What should the main button say?

**8. KEY DIFFERENTIATOR**
What makes you genuinely different from alternatives? This shapes the copy tone and feature framing throughout.

**9. ANIMATION INTENSITY**
On a scale of 1–5, how much animation/motion do you want?
- 1 = Almost none (static page, no motion beyond page load)
- 2 = Subtle (tasteful fade-ins only, smooth hover transitions)
- 3 = Moderate (scroll reveals, hover effects, one hero animation)
- 4 = Rich (GSAP scroll triggers, staggered reveals, interactive components)
- 5 = Cinematic (full GSAP orchestration, physics-based motion, parallax, custom cursors, stateful components)

**10. TECH STACK**
What should the output code use? (e.g., "React + Tailwind + GSAP" / "Vanilla HTML/CSS/JS" / "Vue + Framer Motion"). Any existing component libraries?

**11. CONTENT ASSETS**
Do you have a logo file? Specific photography? Or should the prompt use Unsplash placeholders? If Unsplash, describe the image aesthetic (moody dark? bright minimal? abstract organic?).

**12. SECTION MODIFICATIONS**
Looking at the reference site's sections: for each one, specify whether to:
- **KEEP AS-IS** — same layout pattern, same component type, only your content swapped in
- **ADAPT** — same general pattern, but modified to fit your use case (describe the change)
- **REMOVE** — not needed for your site

Also list any sections you want **ADDED** that don't exist in the reference site.

---

## After Receiving Answers

Confirm you have all 12 answers. If any are missing or too vague to act on, ask for clarification on only those specific questions.

**Save output:** Write the user's 12 answers (with question labels) to `plans/02-brand-interview.md` in the current project directory.

**When complete:** Invoke **ui-cloner-synthesis** to begin Phase 3.
