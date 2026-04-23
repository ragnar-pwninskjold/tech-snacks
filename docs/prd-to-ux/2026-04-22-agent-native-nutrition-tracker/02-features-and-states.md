# Features & States — Agent-Native Nutrition Tracker

_Scoped by the chosen UX philosophy in `01b-ux-philosophy.md`: Conversation as Substrate (Multi-Thread)._

---

## Feature: Agent Chat / Ad-Hoc Query

**User Stories:**

- As a biohacker, I want to ask arbitrary questions about my nutrition data in natural language and get data-backed answers, so I can actually act on what I've logged instead of letting it sit in a void.
- As a biohacker, I want my follow-up questions to carry context from earlier in the same conversation, so I can dig into a topic without re-specifying dates, nutrients, or meals every time.
- As a biohacker, I want to return to a past conversation and keep reasoning from where I left off, so that earlier analysis is a resource I can build on, not a scrollback I have to re-find.
- As a biohacker, I want to see *what data* the agent pulled to answer my question, so I can trust the answer and spot errors when they matter.
- As a biohacker, I want to start a new conversation cleanly when my topic changes, so old context doesn't pollute a new line of thought.

**Screens this feature spans:**

- **Active Conversation View** — the primary surface: the open conversation with its message stream, input composer, and the daily-glance strip alongside (the glance strip itself is its own feature; here it is context).
- **Conversation Sidebar / Drawer** — the list of past conversations, grouped by recency; the navigation surface for multi-thread.
- **Empty-state Home** — first-run or no-conversations-yet landing; orients a new user into their first message.

---

### Screen: Active Conversation View

**Purpose:** the user's primary working surface — sending messages, receiving streaming answers, reviewing past turns in this thread.

**States:**

#### Empty (new conversation, no messages yet)

A freshly started thread with no messages. The user sees a welcoming but low-effort prompt ("Ask about your data — what you ate, what you're short on, how this week compared to last.") and two or three *example question chips* ("What did I eat yesterday?", "How's my magnesium this week?", "Which days did I hit my protein target?"). Tapping a chip pre-fills the composer but does not auto-send — the user commits the question. The glance strip is visible; the composer has focus. **No loading here — the thread is quiet until the user acts.**

#### Loading / Agent-thinking

After the user sends a message, the user's message appears instantly in the stream. A streaming assistant response begins below — the response area shows a subtle *"thinking"* indicator (animated dots, or a minimal shimmer on the assistant message bubble) until the first token arrives. If the agent invokes a tool (e.g., querying the log by date range), a compact *tool-activity line* appears in the assistant's area: "*Pulled 7 days of entries, filtered to magnesium…*". Tool activity and streaming text coexist — the tool line resolves into a citation when the response lands. Composer remains usable — the user can type a follow-up, but sending it while the prior answer is still streaming queues it (with a small inline indicator: "will send after this response") rather than interrupting.

#### Populated (one or more exchanges complete)

The thread shows a vertical stream of alternating user and assistant messages. User messages are right-aligned (or visually distinct — exact styling is a Step 3/4 concern; functionally they're *distinct from* assistant messages). Assistant messages can contain:

- Plain text answers
- **Data citations** — a small, collapsible "Sources" or "Data pulled" element showing what the agent queried (date range, nutrient filter, entry count)
- **Inline insight cards** — compact structured snippets when appropriate (e.g., a small nutrient-vs-target bar, a count, a short list of entries). These are read-only summaries, not interactive dashboards.
- **Follow-up chips** — suggested next questions the agent can generate ("Compare to last week?", "Break down by meal?"), shown below its response. Tapping pre-fills the composer.

The composer at the bottom is a single-line multi-line-capable text input with an inconspicuous send affordance. The most recent assistant message is scrolled into view on completion. Scrolling up reveals the full conversation history; scroll position is preserved when the user navigates away and returns.

#### Error (agent response fails)

Two distinct failure modes:

- **Agent / LLM failure** (API timeout, rate limit, parsing failure): the assistant message area shows an error message in the thread, positioned as if it were the agent's response — "*I couldn't reach the agent to answer that.*" with a **Retry** affordance. The user's original message is preserved (not lost) and can be re-sent unchanged. The composer is usable immediately.
- **Tool / query failure** (log query error, corrupted entry): the streaming response shows the failure where the tool citation would have appeared — "*I couldn't read the log for that range.*" — and the agent does not fabricate an answer. **Retry** re-runs just the tool call; the user's message is not re-sent.

No modal dialogs for errors. Errors live inline, in-conversation.

#### Permission-denied

**Not applicable at the chat level** — v1 is single-user, no auth, local-only. Explicitly recorded: this state is absent by design.

The one *adjacent* permission case: if the MCP server is running and an external agent tries to read the log, that permission flow lives in the MCP Connection feature, not here.

#### Edge cases

- **Very long answer (streamed, many paragraphs):** the assistant bubble grows inline; no artificial truncation. The stream continues to auto-scroll the newest content into view, but if the user scrolls up manually mid-stream, auto-scroll pauses and a small *"Jump to latest"* affordance appears until they return to the bottom.
- **Very long conversation (hundreds of messages):** the thread uses virtualized scrolling. Jumping to a specific past point happens through the Conversation Sidebar (open thread, scroll) — no in-thread search in v1 (record as post-v1). The user can also ask the agent to find something ("what did we say earlier about magnesium?") and the agent can cite its own prior turn.
- **User sends a message while agent is still streaming:** message is queued (as above); no interruption. If the user wants to stop the current response, a **Stop** affordance replaces the send button while streaming is active.
- **User references a recipe by name that doesn't exist** (e.g., "I had the 2026 chili" but no such recipe is saved): agent returns a clarification in-line: "*I don't have a saved recipe called '2026 chili'. Did you mean [closest match], or would you like to create it?*" — with action affordances for both.
- **Ambiguous recipe match** (user says "the chili" with multiple chili recipes saved): agent asks which one inline, listing matches; user picks and the agent proceeds.
- **Offline / Claude API unreachable:** error state as above; additionally, a small persistent *"offline"* indicator appears near the composer so the user knows the chat is non-functional until connectivity returns. The conversation itself (history) is fully readable offline; only new agent responses are blocked.
- **Tool returns zero results** (e.g., "what did I eat on Jan 1" when no entries exist for that date): not an error — agent answers truthfully ("You didn't log any food on January 1.") and citations show the query returned 0 rows.
- **First-time-ever user** (no log entries anywhere): special variant of the empty state (see Empty-state Home screen below).
- **User pastes extremely long text** (accidentally pastes a document): composer handles up to a practical limit; past that, shows a counter and declines to send with a soft message. Post-v1: specify the limit.

**Interaction notes:**

- **Progressive disclosure:** citations / "Sources" blocks are collapsed by default — the answer is primary, the data provenance is secondary. Follow-up chips appear only after the agent has responded (not during streaming). Tool-activity lines resolve into citations when the response lands.
- **Key affordances:** composer (primary), send/stop button (state-dependent), follow-up chips (post-response), citation expander (per-message), new-conversation affordance (likely in sidebar, always reachable), retry (on error states only).
- **What changes between states:** the thread stream grows downward with each turn; the composer state flips between *idle / streaming / error*; the send button becomes a stop button while streaming; follow-up chips appear and disappear per response; the *"offline"* indicator fades in/out on connectivity change.

---

### Screen: Conversation Sidebar / Drawer

**Purpose:** multi-thread navigation — list past conversations, start a new one, rename or delete threads.

**States:**

#### Empty (no conversations yet)

Brand-new user, no threads exist. Sidebar shows a **Start your first conversation** affordance and nothing else — no empty decorative illustration consuming vertical space. This state is short-lived (disappears after the first message in the first thread is sent).

#### Loading

Sidebar loads conversation metadata (titles, last-activity timestamp) from local SQLite. Expected latency is near-zero (local DB), so loading state is a brief skeleton (a few gray list-item placeholders) that should typically not be perceived. If it *is* perceived (slow disk, large history), the skeleton persists rather than flashing an empty state.

#### Populated

Vertical list of conversations, grouped by recency:

- **Today**
- **Yesterday**
- **This week**
- **Earlier** (further-grouped by month if many)

Each item shows: conversation title (auto-generated from first user message or first agent summary, or user-renamed), a last-activity timestamp or relative time, and a subtle indicator if this is the currently-active thread. The active thread is visually distinct (not styled — *functionally* flagged). Hovering / long-pressing an item reveals a secondary actions affordance (rename, delete). A **+ New Conversation** action sits at the top of the sidebar, always reachable.

#### Error

Local DB read failure (rare — SQLite corruption). Sidebar shows a small, un-panicked error line: "*Couldn't load conversations.*" with a **Retry** affordance. User can still start a new conversation (the active thread is independent of sidebar state).

#### Permission-denied

**Not applicable** — local-only, no auth, single user.

#### Edge cases

- **Very large number of conversations (hundreds):** virtualized list; the group-by-recency structure keeps the default view compact (older groups are collapsed by default).
- **Conversation with no messages** (user started a thread, navigated away without sending): auto-named "*New conversation*" with the creation timestamp. Displayed normally; can be deleted. If the user returns to it, it's in the Empty state of Active Conversation View.
- **Rename collision:** two conversations can share a name — no uniqueness requirement. The timestamp differentiates them.
- **Long conversation title:** truncated with an ellipsis in the sidebar; full title on hover / expand.
- **User tries to delete the currently-active conversation:** confirmation prompt; on confirm, navigate to the most recent other conversation, or (if none exist) to Empty-state Home.

**Interaction notes:**

- **Progressive disclosure:** rename / delete are secondary actions revealed on hover / long-press — not primary clutter. Older date groups (Earlier) collapse by default.
- **Key affordances:** + New Conversation (primary), conversation items (tap to open), secondary actions per item (rename, delete on hover / long-press).
- **What changes between states:** list populates incrementally as user creates threads; the active-thread indicator moves as the user switches; timestamps update as new activity lands.

---

### Screen: Empty-state Home

**Purpose:** the very-first-use landing — a user has launched the app, has no conversations and likely no log entries yet. Orients them into their first action.

**States:**

#### Empty (the only meaningful state — this screen exists *to be* the empty state)

Displays a compact welcome line and three entry affordances, ordered by likely-next-action:

1. **Log your first meal** (primary) — pre-fills the composer in a new conversation with a gentle prompt ("*Tell me what you just ate.*").
2. **Ask a question** (secondary) — opens a new conversation in Active Conversation View's Empty state, with example question chips.
3. **Import from Cronometer** (tertiary, only shown if CSV import ships in v1 — else omitted).

Below the primary actions, a short *"your data stays on this machine"* reassurance line — briefly reinforces the ownership promise that motivated the user to try this product at all.

No tour. No multi-step onboarding. No modal.

#### Loading

If the app is doing a first-launch initialization (e.g., building the USDA index), this screen shows a clear *"Setting up your local food database — this takes about a minute"* message with a progress affordance. User cannot log until setup is complete, but can read the reassurance copy.

#### Populated

**Not applicable** — this screen *is* the empty state. Once the user has any conversation, the primary surface on app open is Active Conversation View with the most recent thread.

#### Error

First-launch setup failure (USDA index download/unpack error): the screen shows a clear error with a **Retry** affordance and a fallback *"contact support / file an issue"* affordance that exposes the actual error detail (biohacker audience: they will debug it).

#### Permission-denied

**Not applicable.**

#### Edge cases

- **User deletes all conversations after having used the app:** landing returns to a variant of this screen, but without the *"first meal"* framing — instead *"Start a new conversation"* as the single primary action. A lightweight re-empty, not a re-onboarding.
- **User has log entries but no conversations** (edge case: e.g., they imported from Cronometer first thing): primary action becomes *"Ask about your imported data"* with pre-filled example questions referencing the imported date range.

**Interaction notes:**

- **Progressive disclosure:** no multi-step tour, no dismissible tips carousel. One screen, one choice.
- **Key affordances:** the three entry actions, ranked by likelihood.
- **What changes between states:** once the first conversation is created, this screen is replaced by Active Conversation View as the app's open-state default. It is a transient surface, seen rarely after day one.

---
