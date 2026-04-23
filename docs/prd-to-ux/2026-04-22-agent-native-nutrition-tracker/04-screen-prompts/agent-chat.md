# Agent Chat / Ad-Hoc Query — Screen Prompts

_Each block below is self-contained. Copy one block, paste into Stitch / Figma AI / Pencil / Claude Design._

_Platform context for all blocks in this file: desktop-first web app, accessed at localhost. Not native desktop, not mobile-first — a browser window on a laptop or desktop screen._

---

## Active Conversation View — Empty (new conversation, no messages yet)

````
**What this screen is for:**
Orient the user into their first question in a freshly started conversation, so sending that first message feels like the most natural next action.

**What's visible:**
A primarily empty conversation area with a quiet welcoming line near the top that invites the user to ask about their data — mentioning what they ate, what they're short on, or how this week compared to last. Below the invitation, a small cluster of example question chips shows the kinds of questions the agent can answer: one about what was eaten recently, one about a specific nutrient trend, one about a target being hit. A conversation sidebar is visible on one side, reachable but not demanding attention. A compact daily-glance strip sits alongside or above the conversation area, showing today's key nutrient status at a calm, readable density. The message composer waits at the bottom of the conversation area with focus, ready to accept typing.

**What the user can do:**
- Primary: type a question into the composer and send it.
- Secondary: tap an example question chip to pre-fill the composer (the user still commits the send); open the sidebar to see other conversations or start a new one; tap a nutrient in the daily-glance strip to pre-fill a related question.

**Feel:**
Neutral, modern, trustworthy. A browser-native chat surface that gets out of the user's way. Black, white, and a measured range of grays, with one understated accent reserved for the primary send action. Modern sans-serif, clear weight contrast between the invitation headline and the small chip labels. Generous whitespace — the emptiness of the conversation is intentional, not apologetic. Quietly utilitarian; confident without shouting.

**State context:**
This is the empty state of a newly started conversation. The user has not sent any message in this thread yet. They may or may not have other past conversations in the sidebar — this block is about the thread itself being fresh.

**Critical affordances:**
The composer must visibly have focus — the user should not have to click to start typing. Example chips must feel like *suggestions*, not *prescriptive buttons* — they pre-fill, they do not auto-send. The daily-glance strip must never compete with the composer for attention; it is peripheral information, not the primary surface. The conversation area emptiness is not a dead zone — the invitation and chips make the next action obvious.
````

---

## Active Conversation View — Loading / Agent-thinking

````
**What this screen is for:**
Reassure the user that their question has been received and the agent is working on it, while keeping the door open for a follow-up without blocking the flow of thought.

**What's visible:**
The conversation area shows the user's just-sent message placed in the stream, visually distinct from the agent's side (right-aligned or otherwise clearly the user's turn). Below it, the agent's response area is beginning to populate: first a subtle indication that the agent is thinking — a quiet animated cue, not a heavy spinner. As the agent works, a compact tool-activity line appears in the agent's area, written in natural language describing what the agent is pulling from the log (e.g., the data range and nutrient focus). Once text begins streaming, it flows into the response area word by word, and the tool-activity line resolves into a small, quiet citation element attached to the response. The composer stays at the bottom, usable; the send affordance has transformed into a stop affordance while the stream is active. The daily-glance strip is still visible. The sidebar is unchanged.

**What the user can do:**
- Primary: read the streaming response as it arrives.
- Secondary: stop the current response via the stop affordance; type a follow-up in the composer — if sent while streaming, it queues visibly with a small indicator that it will be sent after the current response completes.

**Feel:**
The thinking cue is calm, not performative — no bouncy dots, no dramatic progress theater. The streaming text should feel like a considered response arriving, not a race. The citation element is quiet and secondary to the answer. Transitions between thinking → tool activity → streaming response are smooth and legible; no sudden layout jumps. Black, white, grays; the accent is reserved for the primary stop affordance so the user notices they can interrupt if they want.

**State context:**
The user has sent a message and the agent is in the middle of responding. Tool calls may still be running, tokens may still be streaming, or both. The composer is not locked — the user can queue a follow-up but cannot disrupt the current response except by explicit stop.

**Critical affordances:**
The send button becoming a stop button must be unmistakable — interruption is a first-class move. The tool-activity line must read like an honest description of what the agent is doing ("pulled seven days of entries, filtered to magnesium"), not a generic loading string. The queued-follow-up indicator, when present, must be unambiguous that the message has not yet been sent — users should never wonder whether their follow-up was lost.
````

---

## Active Conversation View — Populated (one or more exchanges complete)

````
**What this screen is for:**
Give the user a clean, readable record of the conversation so far and an obvious path to the next question, whether as a fresh thought or a natural follow-up.

**What's visible:**
A vertical stream of alternating user and agent messages. User messages are visually distinct from agent messages — their turn is clearly their own. Agent messages contain the primary answer text as the headline element; below or alongside each agent answer, a small collapsible citation element shows what data the agent pulled (date range, nutrient filter, entry count) — collapsed by default, expandable on request. Some agent messages contain compact inline insight snippets when the answer benefits from structure — a small nutrient-vs-target indication, a short list of entries, a comparison. These snippets are read-only summaries; they are not interactive dashboards. Below the most recent agent message, a row of two to four follow-up suggestion chips offers natural next questions ("Compare to last week?", "Break down by meal?"); tapping a chip pre-fills the composer. The composer sits at the bottom, single-line but able to grow for multi-line entries, with the primary send affordance visible. The daily-glance strip is alongside, and the sidebar remains reachable.

**What the user can do:**
- Primary: type a new question or follow-up and send.
- Secondary: tap a follow-up chip to pre-fill the composer; expand a citation element to see what data the agent queried; scroll up to review earlier turns; open the sidebar to switch conversations or start a new one.

**Feel:**
Clean, quietly confident. The conversation reads like a well-kept notebook — everything has its place, nothing shouts. Generous line-height on body text; clear weight contrast between answer text and citation metadata. Insight snippets sit quietly inside the flow — structured, but not decorative. No heavy bubbles or chat-app flourish. The accent color appears only on the primary send and on the chips when they are focused. Neutrals and whitespace carry the hierarchy.

**State context:**
The user has had at least one exchange in this thread. Both sides of the conversation are represented. The thread is the working surface — the user might send a follow-up immediately, or pause to read.

**Critical affordances:**
Citations must be discoverable but not noisy — a user who trusts the agent should be able to read the answer cleanly, while a user who wants to verify can expand and see provenance. Follow-up chips must clearly belong to the most recent agent turn and disappear when the composer has content. User and agent messages must be distinguishable at a glance — sender attribution must never require reading the message to figure out. Inline insight snippets must look like part of the conversation, not inserted dashboard widgets.
````

---

## Active Conversation View — Error (agent or tool failure)

````
**What this screen is for:**
Honestly surface that something went wrong, preserve what the user already typed, and make recovery obvious without a modal dragging the user out of the conversation.

**What's visible:**
The conversation stream continues as normal up to the failure point. Where the agent's successful response would have appeared, an error message takes its place — written in the agent's voice, positioned where a response would have been, clearly marked as an error (not a normal answer). The message is plain-language and specific: the agent couldn't reach its reasoning layer, or a data query failed. A retry affordance sits with the error message. The user's original message remains visible in the stream above, untouched. The composer is usable. If the failure is a tool/query issue (the agent reached the LLM but the log query failed), the error appears where the citation would have been, scoped to that tool call — retry re-runs only the failed query, not the full message. No modal dialog, no full-screen overlay, no banner at the top of the window. A small persistent offline indicator appears near the composer if the failure is connectivity-related.

**What the user can do:**
- Primary: retry — either the full message (agent-layer failure) or the specific query (tool-layer failure).
- Secondary: re-send the message after editing it; start a new conversation; continue reading the rest of the conversation (prior successful turns remain intact).

**Feel:**
Honest and un-panicked. No red flashing, no shouting, no apology theater. The error reads like the agent telling the user what happened in the same calm voice it uses for normal responses. The retry affordance is clearly actionable but does not dominate. Neutrals carry it; any color signal is restrained. The offline indicator, if present, is small and peripheral — a fact, not an alarm.

**State context:**
The user sent a message, and either the agent service or a data-query tool failed. The rest of the conversation is intact. No data was lost; nothing was written to the log in error.

**Critical affordances:**
Errors must live inline in the conversation — never in a modal or full-screen state. The user's original message must be preserved and readable; they should never need to re-type. Retry must be explicit and specific — the user should understand whether they are retrying the whole response or just a sub-step. The voice of error text should match the agent's normal voice, not switch to a system-monitoring register.
````

---

## Active Conversation View — Edge case: very long streaming response, user scrolled up

````
**What this screen is for:**
Let the user freely scroll back through earlier parts of a still-streaming response without being yanked to the bottom by auto-scroll, while keeping the newest content one tap away.

**What's visible:**
The conversation stream is fixed at the scroll position the user chose — earlier message content is readable in full, even as new tokens continue arriving off-screen below. A small, quiet "jump to latest" affordance appears near the bottom edge of the visible area, indicating that there is newer content the user has scrolled past. The composer is still at the bottom of the window, usable. The stop affordance remains available.

**What the user can do:**
- Primary: continue reading at the user's own scroll position.
- Secondary: tap "jump to latest" to snap back to the most recent streaming content; stop the streaming response; continue composing a follow-up.

**Feel:**
Respectful of the user's attention. The product does not fight the user's scroll. The jump-to-latest affordance is discoverable but does not pulse or demand action. When the user returns to the bottom, auto-scroll resumes silently.

**State context:**
The agent is still streaming a long response. The user has scrolled up to re-read earlier content (either earlier in the current response or earlier in the conversation). Auto-scroll is paused because of the manual scroll action.

**Critical affordances:**
Auto-scroll must pause the instant the user scrolls up manually — no fighting. The jump-to-latest affordance must be visually understated but clearly an action. When the user returns to the bottom on their own, auto-scroll resumes without any announcement or animation flourish.
````

---

## Active Conversation View — Edge case: recipe name not found / ambiguous

````
**What this screen is for:**
Handle the case where the user references a saved recipe conversationally, but the agent cannot resolve the name confidently — either because no such recipe exists, or because multiple recipes match the reference.

**What's visible:**
The user's message appears normally in the stream. The agent's response, in place of a normal answer, is a clarification turn. For a *name not found*: the agent says it doesn't have a saved recipe by that name and suggests the closest match if one exists, alongside an offer to create the recipe as new. For an *ambiguous match*: the agent lists the matching recipes (e.g., two different chili recipes, by name and last-edited date) and asks which one. In both cases, action affordances appear inline with the agent's message — clickable options to pick a match, create a new recipe, or return to the composer to rephrase. The conversation continues normally after the user picks.

**What the user can do:**
- Primary: pick a match (ambiguous case) or create the referenced recipe as new (not-found case).
- Secondary: type a clarification in the composer; dismiss the clarification and ask something different.

**Feel:**
Helpful and honest. The agent is asking, not guessing. The inline action affordances look like part of the agent's turn — not popups, not forms. Natural language above the choices so the user understands why the clarification is happening.

**State context:**
The user has referenced a saved recipe by name in their message, and the agent cannot proceed without clarification. No data has been written or miscounted; the agent is pausing for input.

**Critical affordances:**
The inline choice affordances must read as action, not as a listed summary. The create-new-recipe affordance, if present, must route into the dedicated recipe creation flow — not try to collect recipe details inline. The user should always have the option to rephrase via the composer instead of picking a pre-offered option.
````

---

## Active Conversation View — Edge case: offline

````
**What this screen is for:**
Make it unambiguous that the chat cannot send new messages while connectivity is lost, while keeping everything the user has already logged and discussed fully readable.

**What's visible:**
The conversation is fully readable — every prior turn, citation, and insight snippet is present, because they live in local storage. The composer is visibly in a disabled-for-sending state — the user can still type (drafts are preserved), but the send affordance is dimmed and labeled or tooltipped with the reason. A small, quiet offline indicator appears near the composer, explaining in plain language that the agent is currently unreachable and that new responses will resume when connectivity returns. The daily-glance strip continues to show today's data (it reads from the local log). The sidebar continues to function — navigating between past conversations works normally.

**What the user can do:**
- Primary: read past conversation content; navigate the sidebar; type a draft that will be ready to send when connectivity returns.
- Secondary: retry via a small affordance near the offline indicator once connectivity is suspected to be back.

**Feel:**
Calm. Offline is not presented as a catastrophe — it is a temporary limitation, clearly stated, and the parts of the product that can work offline continue to work. Neutrals carry the indicator; no alarm colors.

**State context:**
The local app is running, but the Claude API (or whatever LLM backend is in use) is unreachable. All locally stored data — conversations, log entries, recipes — remains fully accessible.

**Critical affordances:**
The distinction between "can't send a new message" and "can read everything already here" must be unambiguous. Drafts in the composer must never be lost when connectivity returns. The retry affordance should not auto-send the draft — it should restore the send affordance so the user decides whether to send.
````

---

## Conversation Sidebar / Drawer — Empty (no conversations yet)

````
**What this screen is for:**
Give a brand-new user a single obvious entry point into their first conversation, without consuming vertical space on decorative empty-state art.

**What's visible:**
The sidebar occupies its usual location in the layout, visually distinct as a navigation region. Inside it, a single primary action invites the user to start their first conversation. Nothing else. No placeholder thread rows, no illustration, no multi-line coaching text. The rest of the sidebar's space is restfully empty.

**What the user can do:**
- Primary: start a new conversation.
- Secondary: none in this state.

**Feel:**
Minimal and restful. The sidebar's emptiness is not a problem to solve with content — it is simply the truthful state of a new user. One clear action, nothing competing.

**State context:**
The user has never created a conversation. This state is transient — once they start their first thread, it disappears permanently.

**Critical affordances:**
The start-conversation affordance must be unambiguously the primary action of this region. No pretend-disabled rows, no skeleton placeholders — the region is genuinely empty except for the action.
````

---

## Conversation Sidebar / Drawer — Loading

````
**What this screen is for:**
Cover the brief moment while the sidebar loads conversation metadata from local storage, without flashing a misleading empty state.

**What's visible:**
A short vertical list of neutral placeholder rows — roughly sized to match the shape of a real conversation item (a title line and a smaller timestamp line). The placeholders have a subtle animated shimmer indicating loading. The primary new-conversation affordance is still reachable at the top of the sidebar; it does not wait for the list.

**What the user can do:**
- Primary: start a new conversation.
- Secondary: wait — this state should typically last a fraction of a second.

**Feel:**
Quiet and brief. No spinner. The shimmer is subtle, the placeholders are honest about their purpose. If this state persists, it does not become noisy — it stays understated.

**State context:**
The app is reading conversation metadata from the local database on open or after a navigation event. Local reads are typically near-instant; this state exists to cover rare slow cases honestly rather than flashing "empty" and then "populated."

**Critical affordances:**
The new-conversation action must work during loading — it does not depend on the list being ready. The placeholders must clearly be placeholders, not mistakable for real (unreadable) conversation titles.
````

---

## Conversation Sidebar / Drawer — Populated

````
**What this screen is for:**
Give the user a fast, browsable index of their conversations so they can return to a past thread or start a new one at any time.

**What's visible:**
A vertical list of conversations, grouped by recency headings — Today, Yesterday, This week, Earlier (further grouped by month if many). Each list item shows the conversation title (auto-generated from the first message or first agent summary, unless the user renamed it) and a compact relative timestamp. The currently-active conversation is visually flagged so the user always knows where they are. A clearly primary new-conversation action sits at the top of the sidebar, always reachable. Hovering or long-pressing a conversation item reveals secondary actions — rename and delete — that are hidden until invited. Older date groups collapse by default once there are enough items that collapsing keeps the default view compact.

**What the user can do:**
- Primary: tap a conversation to open it in the main conversation area; start a new conversation.
- Secondary: rename or delete a conversation via its per-item actions (revealed on hover/long-press); expand a collapsed date group.

**Feel:**
A quiet, well-organized index. Item titles have clear weight dominance over timestamps. Group headings are smaller and understated — structural, not decorative. The active-conversation flag is legible but does not shout. Generous spacing between items without wasting vertical room.

**State context:**
The user has one or more past conversations. At least one is active (currently open in the main area). Date groups structure the list by recency.

**Critical affordances:**
The active-conversation indicator must be unambiguous at a glance — the user should never wonder which thread they are currently in. Rename and delete must be secondary actions, not primary clutter. New-conversation remains always-reachable regardless of how many threads exist.
````

---

## Conversation Sidebar / Drawer — Error (local DB read failure)

````
**What this screen is for:**
Surface a rare local-storage failure honestly without panicking the user, while keeping the parts of the product that still work fully available.

**What's visible:**
A short error line in the sidebar's list area: plain language stating that conversations couldn't be loaded. A retry affordance sits next to the error line. The new-conversation action at the top of the sidebar remains functional, because starting a new thread does not depend on reading old ones.

**What the user can do:**
- Primary: retry loading the conversation list.
- Secondary: start a new conversation regardless.

**Feel:**
Un-panicked. The error is a fact, not a crisis. Understated, no alarm colors, no large error illustration. If a small recovery hint is appropriate ("You can still start a new conversation while this is being retried"), it reads calmly.

**State context:**
A rare local SQLite read failure has prevented the sidebar from loading conversation metadata. The main conversation area may still be functional if the active thread loaded before the failure.

**Critical affordances:**
Retry must be obvious and specific. The still-functional parts of the product must not be collaterally hidden by the sidebar error — the new-conversation affordance stays live.
````

---

## Conversation Sidebar / Drawer — Edge case: deleting the active conversation

````
**What this screen is for:**
Safely handle the intent to delete the conversation the user is currently reading, with a confirmation step and a sensible landing destination afterward.

**What's visible:**
A confirmation prompt appears in response to the delete action — inline near the affected sidebar item, or as a compact dialog that does not fully take over the screen. The prompt names the conversation being deleted and states that deletion is permanent. Two actions: confirm delete, and cancel. After confirmation, the app navigates the user to the most recent other conversation automatically; if no other conversations exist, it routes to the empty-state home surface.

**What the user can do:**
- Primary: confirm or cancel the deletion.
- Secondary: none — the prompt is narrowly scoped to this one decision.

**Feel:**
Honest about permanence without being alarming. The confirmation reads clearly but does not shout. The destructive confirm action is visually distinct from the cancel, so mis-taps are unlikely.

**State context:**
The user has just triggered the delete action on the currently-open conversation. Confirmation is pending. The underlying conversation still exists in local storage until the user confirms.

**Critical affordances:**
The destructive nature of the action must be visible in the confirmation copy. Cancel must be the visually easier path — no dark patterns. The post-delete navigation must always land the user somewhere usable, never on a broken or blank state.
````

---

## Empty-state Home — Empty (first-use, no conversations)

````
**What this screen is for:**
Land a brand-new user on a surface that makes the most likely first action — logging a first meal or asking a first question — immediately obvious, with no tour and no multi-step onboarding.

**What's visible:**
A compact welcome line near the top of the main area — one or two sentences that name the product and what it does, without marketing language. Below it, three entry affordances ranked by likely-next-action: first, a primary "log your first meal" action that opens a new conversation with the composer pre-framed for logging; second, a secondary "ask a question" action that opens a new conversation in its empty state with example question chips; third, an optional tertiary "import from Cronometer" action if CSV import is part of the shipping feature set (otherwise omitted entirely, not shown as disabled). Below the primary actions, a short reassurance line reinforces that the user's data lives on their machine. The sidebar is visible (empty state). No modal, no tour overlay, no dismissible coaching carousel.

**What the user can do:**
- Primary: start logging a first meal.
- Secondary: ask a first question; import existing data if that option ships.

**Feel:**
Welcoming but not needy. The screen invites the user in with one clear ordered ladder of choices and then gets out of the way. Whitespace carries the hierarchy. The three actions are differently weighted — primary, secondary, tertiary — so the ladder is legible at a glance. No decorative illustration, no hero image. Confident, quiet, honest.

**State context:**
The user has just launched the app for the first time. No conversations exist. No log entries likely exist yet. This screen is transient and will typically not be seen again after the first session.

**Critical affordances:**
The primary action must be unmistakably primary — it leads the user into the core loop. The absence of a tour is intentional; do not reintroduce one. The "your data stays on this machine" line is a brief reassurance, not a legal disclosure — its job is trust, not compliance copy.
````

---

## Empty-state Home — Loading (first-launch USDA setup)

````
**What this screen is for:**
Honestly communicate that a one-time local setup step is in progress on first launch, so the user knows why they can't log yet and how long the wait is.

**What's visible:**
A clear status line explaining that the local food database is being set up and that this takes about a minute. A progress affordance sits with the status — either a bar or a compact indicator with percentage — showing that progress is real. Below the progress, the same reassurance line from the empty state ("your data stays on this machine") remains visible. The three entry actions from the empty state are hidden or clearly un-invokable during setup — they return once setup completes. The sidebar is visible but empty.

**What the user can do:**
- Primary: wait for setup to complete.
- Secondary: read the reassurance copy; none else — this is a gated state by design.

**Feel:**
Honest about the wait. Not hidden behind a generic spinner, not padded with marketing copy to fill the time. The progress is real and readable. Tone is calm; the user should not feel the product is broken.

**State context:**
First-ever launch of the app. The USDA food database is being downloaded and/or indexed locally. Until complete, logging is not possible.

**Critical affordances:**
The "about a minute" framing must be honest — if setup is longer in some environments, the copy or progress must reflect reality. Progress must actually move; a stuck bar must surface as an error, not pretend to progress.
````

---

## Empty-state Home — Error (setup failure)

````
**What this screen is for:**
Honestly surface a first-launch setup failure to a technically sophisticated user, with enough detail for them to debug and a clear path to retry.

**What's visible:**
A plain-language error headline stating that the local food database couldn't be set up. Beneath, a specific explanation of what failed (download error, disk space, unpack error) written in language a technically sophisticated user can act on. The actual error detail is visible (not hidden behind "expand details") because the target audience will want to debug. A retry affordance is the primary action. A secondary affordance points to a support or issue-filing destination in case retry doesn't resolve it. The reassurance copy is not shown here — this state is about failure, not trust-building.

**What the user can do:**
- Primary: retry setup.
- Secondary: access a support destination with the error detail.

**Feel:**
Honest and technical. The error respects the user's competence — no vague "something went wrong" copy, no condescending reassurance. Neutral typography, restrained error signaling. The error detail reads like logs, not like marketing.

**State context:**
The USDA setup failed during first launch. The app is not yet usable. No conversations or entries exist yet.

**Critical affordances:**
The error detail must be visible by default, not hidden behind a disclosure. Retry must genuinely retry — it must not require a full app restart unless that is actually necessary. The support destination must be a real action, not a marketing link.
````

---

## Empty-state Home — Edge case: user deleted all conversations after use

````
**What this screen is for:**
Handle the case where a returning user has deleted every conversation and now lands on an empty home surface — but without treating them like a first-time user, because they are not.

**What's visible:**
A compact line inviting the user to start a new conversation, without the first-time welcome framing. The primary action is "start a new conversation" — singular, not ladder. The reassurance copy about local storage is not shown (they already know). The sidebar shows its empty state. The daily-glance strip continues to show today's data if any log entries exist (which they likely do — only conversations were deleted).

**What the user can do:**
- Primary: start a new conversation.
- Secondary: none.

**Feel:**
Restful and short. Not a re-onboarding. The user is not a stranger.

**State context:**
The user has previously used the app and has existing log entries, but has deleted every conversation. They may still have saved recipes and logged meals.

**Critical affordances:**
The copy must not recycle first-time language ("welcome", "get started"). The single primary action should feel like a continuation of the user's existing usage, not a fresh introduction.
````

---

## Empty-state Home — Edge case: imported data, no conversations

````
**What this screen is for:**
Handle the case where a new user has imported data (e.g., via Cronometer CSV) but hasn't yet had any conversation, so the most likely first action is asking about the imported data — not logging something new.

**What's visible:**
A welcome line that acknowledges the imported data ("your data is loaded — ask a question to explore it"). The primary action becomes "ask about your imported data" with example question chips pre-referencing the imported date range ("What did I average for protein last month?", "Which weeks hit my magnesium target?", "What did I eat on [specific date from the import]?"). The logging action remains available as a secondary. The reassurance copy about local storage is shown briefly. The sidebar is in its empty state. The daily-glance strip reflects today's data (likely empty unless the import includes today).

**What the user can do:**
- Primary: ask about the imported data using one of the pre-referenced example questions, or type their own.
- Secondary: log a new meal.

**Feel:**
A calm acknowledgment that the user brought data with them, and a ladder into the product that leverages that data. Example chips are specific to the import range, not generic — they look thoughtful, not templated.

**State context:**
The user has imported historical nutrition data from another source. They have not yet had a conversation in this app. Log entries exist but conversations do not.

**Critical affordances:**
The example chips must reference real dates or date ranges from the imported data — specificity is the payoff of having imported at all. If the import includes today's data, the logging action should reflect that contextually rather than assume a blank slate.
````

---
