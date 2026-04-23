# Agent-Native Nutrition Tracker — PRD

## Elevator Pitch
A local-first nutrition tracker where the agent *is* the interface: log food in seconds by typing, then ask any question about your data and get a real answer. Your log lives on your machine and is readable by any LLM you connect.

## Problem Statement
Biohackers and performance optimizers want to interrogate their nutrition data — "am I short on magnesium this week?", "what was I eating the week my energy crashed?" — but the apps that hold that data (Cronometer, MyFitnessPal) are built for human dashboards, not machine queries. The sophisticated workaround is writing Go scripts and browser automation to scrape their own data. The common outcome is giving up on insights entirely and logging into a void. The data is trapped inside a chart-first product; the analysis layer the user actually wants doesn't exist.

## Target Audience
**Primary persona — the biohacker / performance optimizer.** Tracks multiple data streams (food, sleep, HRV, workouts), thinks in experiments and interventions, uses LLMs daily, is frustrated by the gap between the data they log and the questions they want to ask. Technically sophisticated — comfortable running a local web app, connecting an MCP server to Claude Desktop, editing a JSON config if needed. Will pay for the right tool and will tell their community.

**Context of use:** at their desk, during or after a meal, asking both quick logging questions ("log lunch: grilled salmon, broccoli, rice") and reflective analytical ones ("what's driving my energy dips this week?").

## Target Platforms
Desktop-first web app (runs locally, accessed at `localhost`). Mobile-responsive is a future concern — v1 designs for the desk-sitting case. Do not design for mobile-first logging patterns (thumb-tap camera flows, single-hand keyboard).

## USP
**Ownership + LLM-agnostic + chat-first speed.** Two things no existing tracker combines:

1. **Your data, your machine, your LLM.** Everything lives in a local SQLite database. An MCP server exposes the full log to any LLM you connect — Claude Desktop, your own agent, a script you wrote. No cloud, no vendor lock.
2. **No dashboards to decode.** Logging takes seconds (type what you ate). Insight takes one question (ask it). There is no chart grid to learn, no macro pie to interpret — the conversation *is* the product.

This is not a chatbot bolted onto a dashboard app. It is an agent-native data model with a minimal logging surface — the inverse of every existing tracker.

## Product Rationale
The underlying bet: once an LLM has structured, complete nutrient data, nutrition reasoning is already a solved problem. The gap is *access*. So the product strips away everything that isn't logging or querying — no meal planning, no gamification, no social layer — and invests in two things: (1) a data schema that stores the full USDA nutrient vector per entry, and (2) a chat surface where the agent is a first-class citizen with tools to read that data. The reusable-recipe feature exists because biohackers eat the same curated combinations repeatedly and need to reference them by name conversationally ("I had the 2026 chili"), not re-enter ingredients.

## Primary User Journeys

**Journey 1 — Logging a meal.**
User types what they ate into the chat input ("lunch: grilled salmon, steamed broccoli, brown rice"). The agent parses it, matches each item against the USDA database, returns a proposed entry with nutrient breakdown. User confirms or edits inline, and the entry is written to the local log. Total time target: under 15 seconds for a typical meal.

**Journey 2 — Asking the agent a question.**
User types an ad-hoc question into the same chat surface — "what's my omega-3 trend this week?", "which days did I hit my protein target?", "what was I eating the week I felt tired?". The agent queries the log, reasons over the returned data, and responds with a data-backed answer. The conversation persists so follow-ups are natural.

**Journey 3 — Glancing at today's intake.**
Before or after a meal, the user wants a sanity check — how much protein have I had today, am I over on sodium, what am I short on vs. my targets. They look at a persistent daily-summary surface (not a dashboard page — a compact, always-visible strip or panel) that shows today's key nutrients against RDA targets. This is a *glance*, not an analysis — the chat is still where the user goes for the "why."

**Journey 4 — Creating a reusable recipe.**
User opens a dedicated recipe-creation flow and enters a named recipe once: name, ingredients with quantities, servings. The recipe is saved to the local library. Later, in chat, the user can reference it conversationally — "I had the 2026 chili for dinner" — and the agent resolves the name to the recipe's nutrient composition without re-parsing ingredients. Recipes can be viewed and edited conversationally in chat ("show me the 2026 chili", "change the beans to black beans").

**Journey 5 — Connecting their own LLM via MCP.**
The user wants to use their own agent (Claude Desktop, a custom script, another LLM client) instead of — or alongside — the built-in chat. They open the MCP connection surface, copy the connection config, and wire it into their LLM of choice. Success is the moment their external agent successfully queries the log. This is the "your data, your LLM" promise made concrete.

## Features List

### Text-based food logging
- **User Stories:** As a biohacker, I want to type what I ate in natural language and have it parsed into structured log entries with full nutrient data, so I can log a meal in under 15 seconds without fighting a form.
- **UX/UI Considerations:** Single chat input, persistent. Free-text entry. System shows a proposed structured entry before committing — user can confirm or edit each item inline (quantity, USDA match). Ambiguous matches ("which kind of salmon?") surface as clarification prompts, not silent guesses. Entry write is explicit, not automatic.
- **Success Moments:** The user types a sloppy description, sees it come back cleanly structured with real nutrients, and thinks *"that was easier than opening Cronometer."* The moment a clarification prompt catches a misparse and lets them fix it inline — they feel heard, not corrected.

### Agent chat / ad-hoc query
- **User Stories:** As a biohacker, I want to ask arbitrary questions about my nutrition data in a conversation and get data-backed answers, so I can actually act on what I log instead of logging into a void.
- **UX/UI Considerations:** Same chat surface as logging — one input, one conversation, no mode toggle. The agent has tools to query the log by date range, nutrient, meal context. Responses cite what data was pulled so the user can trust the answer. Streaming responses for latency tolerance. Conversation history persists across sessions.
- **Success Moments:** The user asks a question they couldn't previously answer without a Go script, gets a useful answer in under 10 seconds, and feels *"the data is finally mine."* The moment a follow-up question ("and how does that compare to last week?") works naturally without re-specifying context.

### Daily summary glance
- **User Stories:** As a biohacker, I want a persistent at-a-glance view of today's nutrients vs. my targets, so I can course-correct the next meal without asking the agent.
- **UX/UI Considerations:** Not a page — a persistent surface (top bar strip, side panel, or chip row) visible alongside the chat. Shows today's key nutrients vs. RDA targets — compact, readable at a glance. Tap/click a nutrient to drill into the day's entries for that nutrient. Defaults to hardcoded USDA DRIs; user-configurable targets are out of scope for v1.
- **Success Moments:** Before dinner, user glances up, sees *"magnesium 40% of target"*, decides on spinach. The moment the glance answers the question without a chat turn — they feel the product is working for them, not requiring them.

### Recipe creation (dedicated flow)
- **User Stories:** As a biohacker, I want to save recipes I eat regularly with a name, so I can log them conversationally later by name without re-entering ingredients every time.
- **UX/UI Considerations:** Dedicated creation flow (separate from chat) — a structured form: recipe name, ingredient list with quantity + USDA match per ingredient, number of servings. Ingredient entry follows the same parsing + match + confirm pattern as meal logging. Saved recipes live in a local library. Editing and viewing a saved recipe happens conversationally in chat only — no list/grid view in v1.
- **Success Moments:** User finishes entering a 10-ingredient recipe once, names it, and feels *"I never have to type this again."* Weeks later, they say "I had the 2026 chili" in chat, the agent resolves it instantly, and they feel the payoff of that earlier investment.

### MCP server connection
- **User Stories:** As a biohacker who already has a preferred LLM setup, I want to connect my nutrition log to my own agent via MCP, so I can query it from Claude Desktop or any other MCP-capable client.
- **UX/UI Considerations:** A dedicated surface (settings page or modal) that shows: connection config (copy-paste block), per-tool description (what each MCP tool does), connection status (is the server running?), and a verification step ("test connection from your LLM"). Target: connection completes in under 5 minutes for a user who already uses Claude Desktop.
- **Success Moments:** User pastes the config into Claude Desktop, asks their own Claude "what did I eat yesterday?", and it answers. That moment — their agent querying their data — is the product's core promise made tangible.

## Non-Goals / Anti-Goals

**Anti-goals for v1 (the product explicitly refuses these, even if users ask):**

1. **Gamification** — no streaks, badges, leaderboards. This is a tool, not a game.
2. **Social features** — no sharing meals, no following users, no community feed. The product is single-user and private.
3. **Coaching / prescriptive advice** — the app does not tell the user what to eat. It answers questions; it does not prescribe.
4. **Meal planning / recipe discovery** — no suggestions for what to cook. Recipe creation is for the user's own reuse, not discovery.
5. **Weight / body-composition tracking** — no scale integration, no progress photos, no weight graphs. This is a nutrition log, not a body-tracking app.
6. **Dashboard-style charts as primary surface** — the product is chat-first. The daily glance is a narrow compact surface, not a chart grid. If it starts to look like Cronometer-with-a-bot, the design has failed. *(Likely permanent, not just v1.)*
7. **Calorie-counting / diet-tool framing** — the product is not positioned or shaped as a weight-loss or diet tool. Calories are one of 70+ nutrients, not the headline metric.

**Also deferred (not anti-goals, just out of scope for v1):**
- Voice logging, photo logging (scope + accuracy risk)
- Proactive daily briefings from the agent
- Cloud sync / multi-device
- Auth / accounts
- User-configurable RDA targets
- Cronometer / MyFitnessPal CSV import (nice-to-have, not core)

## Open Questions

1. **Daily summary form factor.** The glance surface could be a top bar strip, a side rail, a collapsible panel, or a chip row in the chat header. The right answer depends on how much data needs to be visible at once and how the user's eye moves between chat and glance. *Resolved in Step 1.5 (UX philosophy) / Step 2 (state design).*
2. **Clarification prompt style.** When parsing a food entry is ambiguous ("salmon" — farmed or wild?), does the agent inline the clarification in the chat flow, or surface an edit affordance on the proposed entry itself? *Resolved in Step 2.*
3. **Recipe reference in chat — disambiguation.** If the user says "I had the chili", is there a name-match UI (dropdown, confirm step) or does the agent just pick the most recent / most likely match? *Resolved in Step 2 (state design for ambiguous recipe match).*
4. **MCP connection surface placement.** Settings page, modal, dedicated route, or first-run onboarding artifact? *Resolved in Step 1.5 / Step 2.*
5. **Conversation persistence boundary.** Is there one long-lived chat (all history, one thread) or per-day / per-session chats? Affects nav structure and how "ask a follow-up later" feels. *Resolved in Step 2.*
