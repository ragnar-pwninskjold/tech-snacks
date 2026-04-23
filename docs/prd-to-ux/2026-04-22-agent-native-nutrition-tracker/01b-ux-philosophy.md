# UX Philosophy — Agent-Native Nutrition Tracker

## Chosen Philosophy: Conversation as Substrate (Multi-Thread)

**Organizing metaphor / mental model:**
The conversation *is* the log, but there are many conversations — named, dated threads the user can return to — so referencing past context later is a first-class move, not a scrollback hunt.

**How the PRD features map into this structure:**

- **Text-based food logging** → a user message in the active conversation. The agent replies inline with a proposed structured entry (item name, USDA match, quantity, nutrient breakdown). The user confirms or edits the entry inside the same message bubble / attached card — no separate confirmation screen. Ambiguous matches surface as an inline clarification prompt ("did you mean farmed or wild salmon?") rather than a silent guess.

- **Agent chat / ad-hoc query** → another message in the same conversation. No mode switch between logging and asking — one input, one stream. The agent's responses are streaming, cite the data pulled (date range, tool call), and support natural follow-ups ("and how does that compare to last week?") without context re-specification.

- **Daily summary glance** → a persistent, compact nutrient-chip strip that lives *alongside* the active conversation — always visible, always today's data. Tapping a chip does not navigate away; it drops a pre-formed question into the chat input ("why am I low on magnesium today?") that the user can send or edit. The glance is a launcher into conversation, not a destination.

- **Recipe creation (dedicated flow)** → entry point is a clearly affordanced action (e.g., a "+" menu or a nav item labeled Recipes) that opens a structured recipe-creation surface — separate from chat, because one-time structured entry is not a chat job. Once saved, recipes have no browsable list or grid view in v1; they exist as *referenceable names the agent resolves in chat* ("I had the 2026 chili"). Editing and viewing happens conversationally ("show me the 2026 chili", "change the beans to black beans").

- **MCP server connection** → a settings surface (modal or dedicated route) reached from a gear/settings affordance. Shows connection config, per-tool descriptions, server status, and a verification step. The active conversation shows a small persistent indicator when an external agent is connected — a subtle reinforcement of the "your data, your LLM" promise.

- **Multi-conversation navigation (introduced by this philosophy):** conversations are persistent objects listed in a sidebar or drawer — dated by default, optionally named by the user or auto-named by the agent from content. The user can start a new conversation at any time, return to a past one, rename it, and reference it implicitly by asking the agent to "find that thread where I asked about magnesium." This resolves PRD Open Question #5 (conversation persistence boundary).

**Trade-offs:**

- **Good at:**
  - Reinforces the agent-first USP — the product looks like a chat client that knows what you ate, not a dashboard with a chatbot pinned to it
  - Zero mode switching between logging and querying — one surface, one input, one flow of thought
  - Multi-thread structure gives historical reference the strength Philosophy 1 (single-thread) lacked — "go back to the conversation where I was figuring out my protein intake" is a real action
  - Low cognitive load at any given moment: the user is either in a conversation or looking at the sidebar. Two surfaces, not five.
  - The daily glance answers the "course-correct before dinner" need without requiring a chat turn, while still feeding back into chat when deeper reasoning is wanted

- **Sacrifices:**
  - Calendar-style "show me all meals on a specific date" is not a native primary surface — the user would ask the agent ("what did I eat on March 18?") rather than navigate to a date page. Works, but is a chat turn away.
  - Browsable recipe library is deferred — users who want to scan their saved recipes visually can't in v1; they must ask the agent. This is an intentional consequence of the chat-first bet.
  - Multi-conversation introduces thread-management surface area (naming, organizing, deleting) that single-thread Philosophy 1 avoided. Needs thoughtful defaults (auto-dated names, auto-grouping by period) so the sidebar does not become a chore.
  - Users coming from Cronometer expect a day-view / list-of-meals page. This philosophy does not provide one. Expectation mismatch is a real onboarding risk — mitigated by the chat being genuinely good at answering "what did I eat today" on demand.

**Why the user chose this:**
User picked Philosophy 1 (Conversation as Substrate) and modified it: conversations are not one persistent stream but many named/dated threads, so historical reference is easier and the sidebar becomes a real navigation surface. This blend keeps the agent-first USP intact while addressing the historical-browsing weakness the single-thread version surfaced as a trade-off.

---

## Rejected Alternative 1: Journal with an Assistant

**Metaphor:** A structured daily journal (today, yesterday, calendar) is the primary surface; chat lives next to it as a side panel.

**Feature mapping summary:** Logging happens in a day-view input, entries stack chronologically. Chat is a docked side panel. Daily glance is the day-view header. Recipes live in a left nav. MCP connection in settings.

**Trade-offs:** Strong for historical browsing and for users who already model food logs as day pages (Cronometer veterans). Sacrifices the USP — "chat bolted on a log" is precisely the positioning the product claims to invert. Two surfaces for two jobs = two things to learn.

**Why rejected:** Soft-betrays the agent-native thesis. The product claims the agent is not a bolt-on — leading with a journal surface makes the chat feel secondary.

## Rejected Alternative 2: Command Bar First

**Metaphor:** A global command bar (Linear / Raycast / Superhuman feel) is the entire interface. Users type commands (`log:`, `ask:`, `recipe: new`) and results render in a pane below.

**Feature mapping summary:** Logging, querying, recipe creation, MCP config are all command intents. Daily glance is a pinned status line. Keyboard-driven throughout.

**Trade-offs:** Matches the biohacker aesthetic (they love Raycast), extremely fast once learned. Sacrifices discoverability — new users don't know what commands exist; the "just ask a question" promise requires knowing to prefix with `ask:` or trusting smart inference. Recipe browsing is especially weak.

**Why rejected:** Discoverability cost is too high for v1, where onboarding and the "first insight" moment have to land clean. The command-bar feel can be layered into the chosen philosophy later (e.g., a `⌘K` global input) without committing the whole product to it.
