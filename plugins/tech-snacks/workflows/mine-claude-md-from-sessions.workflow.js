export const meta = {
  name: 'mine-claude-md-from-sessions',
  description: 'Mine last N project sessions for non-obvious CLAUDE.md candidates, adversarially verify, loop until dry',
  whenToUse: 'When you want to harvest documentation-worthy patterns from recent coding sessions for a project and propose CLAUDE.md additions. Pass args: {projectPath, sessionCount?, maxRounds?}.',
  phases: [
    { title: 'Discover', detail: 'resolve project, list last N sessions, build ONE merged compact digest (CLAUDE.md once)' },
    { title: 'Mine', detail: 'parallel agents propose non-obvious CLAUDE.md candidates from the merged digest + live code' },
    { title: 'Verify', detail: 'one combined-lens skeptic adversarially challenges each candidate (pipelined)' },
    { title: 'Synthesize', detail: 'assemble surviving candidates into a proposal report' },
  ],
}

// ---- args ---------------------------------------------------------------
// args.projectPath  : absolute path to the project repo (required)
// args.sessionCount : how many recent sessions to read (default 20)
// args.maxRounds    : safety backstop on mining rounds (default 6)
// args.dryRounds    : consecutive empty rounds that mean "done" (default 2)
// args.miners       : miners per round (default: auto 2-4 from session count)
// Accept args as an object OR a JSON string OR a bare path string.
let A = args
if (typeof A === 'string') {
  const s = A.trim()
  if (s.startsWith('{')) {
    try { A = JSON.parse(s) } catch (e) { A = { projectPath: s } }
  } else {
    A = { projectPath: s }
  }
}
A = A || {}
const PROJECT = A.projectPath || ''
const SESSION_COUNT = A.sessionCount || 20
const MAX_ROUNDS = A.maxRounds || 6
const DRY_ROUNDS = A.dryRounds || 2

if (!PROJECT) {
  throw new Error('mine-claude-md-from-sessions requires args.projectPath (absolute path to the repo).')
}

// ---- schemas ------------------------------------------------------------
// Discover now returns the merged digest TEXT inline (carried in-context to
// miners) instead of a list of per-session file paths. CLAUDE.md is included
// exactly once, in the digest header, so no agent re-reads it N times.
const DISCOVER_SCHEMA = {
  type: 'object',
  required: ['sessionsDir', 'claudeMdPath', 'claudeMdExists', 'sessionsDigested', 'digest'],
  properties: {
    sessionsDir: { type: 'string', description: 'Resolved ~/.claude/projects/<slug> directory' },
    claudeMdPath: { type: 'string', description: 'Path where the project CLAUDE.md is/should be' },
    claudeMdExists: { type: 'boolean' },
    claudeMd: { type: 'string', description: 'Full current CLAUDE.md text (or empty if none) — included so verifiers can dedup without re-reading the file' },
    sessionsDigested: { type: 'integer', description: 'How many sessions made it into the merged digest' },
    digest: { type: 'string', description: 'The SINGLE merged, deduped digest text across all sessions. Miners read this inline — no file round-trips.' },
    digestPath: { type: 'string', description: 'Absolute path where the merged digest was also written to disk (for reference / large-digest fallback)' },
    notes: { type: 'string', description: 'Anything notable about discovery (missing dir, fewer sessions than asked, truncation applied, etc.)' },
  },
}

const CANDIDATE_SCHEMA = {
  type: 'object',
  required: ['candidates'],
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'pattern', 'whyNonObvious', 'filesInvolved', 'evidence', 'proposedText'],
        properties: {
          id: { type: 'string', description: 'short kebab-case slug, unique within this round' },
          title: { type: 'string' },
          pattern: { type: 'string', description: 'The actual pattern/convention/gotcha, stated plainly' },
          whyNonObvious: { type: 'string', description: 'Why this CANNOT be inferred from directory/file structure alone, and which multiple files you had to correlate to see it' },
          filesInvolved: { type: 'array', items: { type: 'string' }, description: 'The 2+ files that together reveal the pattern' },
          evidence: { type: 'string', description: 'Concrete evidence: session quote/decision or code correlation that establishes the pattern' },
          proposedText: { type: 'string', description: 'The exact markdown line(s) to add to CLAUDE.md' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['id', 'survives', 'reason', 'failureMode'],
  properties: {
    id: { type: 'string' },
    survives: { type: 'boolean', description: 'true ONLY if this is a genuine non-obvious, multi-file, non-structural, not-already-documented pattern' },
    reason: { type: 'string' },
    failureMode: {
      type: 'string',
      enum: ['none', 'inferable-from-structure', 'single-file-obvious', 'already-documented', 'not-a-pattern', 'unsupported-by-evidence'],
      description: 'Why it was rejected (or "none" if it survives)',
    },
  },
}

// ---- helpers ------------------------------------------------------------
const key = (c) => (c.title + '|' + (c.filesInvolved || []).slice().sort().join(',')).toLowerCase().replace(/\s+/g, ' ').trim()

// =========================================================================
// PHASE 1: DISCOVER  — one merged digest, CLAUDE.md once, carried in-context
// =========================================================================
phase('Discover')

const discovery = await agent(
  `You are preparing source material for mining a project's recent Claude Code sessions.
Your output is ONE merged digest carried in-context to downstream miners — make it
information-dense and reasonably small, but DO NOT over-truncate reasoning.

PROJECT PATH: ${PROJECT}
SESSION COUNT: ${SESSION_COUNT}

Do ALL of this with Bash + Read/Write:

1. Compute the session storage slug. Claude Code stores sessions at ~/.claude/projects/<slug>/
   where <slug> is the absolute project path with every "/" and "." replaced by "-". Derive the
   slug for "${PROJECT}" and verify the directory exists (ls it). If it doesn't exist, try:
   ls ~/.claude/projects/ | grep -i the trailing path component, pick the best match. Report in "notes".

2. Find the CLAUDE.md for this project. Check "${PROJECT}/CLAUDE.md" first, then
   "${PROJECT}/.claude/CLAUDE.md". Set claudeMdExists + claudeMdPath. If it exists, READ IT FULLY
   and return its text in "claudeMd". This is included ONCE here so downstream agents never re-read it.

3. List the session .jsonl files newest-first by mtime ("ls -t *.jsonl") and take the first ${SESSION_COUNT}.

4. Build ONE merged digest (NOT per-session files). Create scratch dir
   "${PROJECT}/.pro-brown/scratch/clmd-mining/" (mkdir -p) and write the merged digest to
   "<scratch>/merged-digest.md". Use a python3 heredoc to parse the JSONL robustly (wrap each
   json.loads in try/except; line shapes vary). The merged digest must contain, in this order:

   a. A fenced header block titled "=== ALREADY DOCUMENTED (current CLAUDE.md) ===" with the full
      current CLAUDE.md text (or "(none)"). Include it ONCE for the whole digest.
   b. For each session, a "## session <shortId> — <ai-title if present>" block containing:
      - Every USER prompt text (type=="user" human turns — extract message text, skip tool_result attachments). Keep FULL.
      - Assistant NON-tool text turns (type=="assistant" text blocks) — the reasoning/explanations.
        Truncate each to ~1200 chars BUT if a turn is longer, ALSO append its final ~300 chars
        (the conclusion of a turn often carries the decision/gotcha — do not lose it).
      - The DISTINCT set of file paths touched by tool calls (Read/Edit/Write/Bash file args) —
        the cheapest signal for "which files were correlated". List them deduped.
   c. DROP all tool_result payloads, thinking blocks, base64, and system reminders — they are noise.

   Dedup aggressively ACROSS sessions: if the same user prompt / file-set recurs, note "(recurs Nx)"
   rather than repeating it. Aim for a merged digest under ~80KB total; if you must truncate to hit
   that, drop the OLDEST sessions' assistant-text first (keep all file-path sets), and say so in "notes".

5. Return: sessionsDir, claudeMdPath, claudeMdExists, claudeMd (full text or ""),
   sessionsDigested (count actually included), digest (the FULL merged digest text, inline),
   digestPath (the scratch file path), and notes.

The digest is the entire point — dense, deduped, conclusion-preserving.`,
  { phase: 'Discover', schema: DISCOVER_SCHEMA, label: 'discover+merge-digest' }
)

log(`Discover: merged ${discovery.sessionsDigested} sessions (${(discovery.digest || '').length} chars) from ${discovery.sessionsDir}. CLAUDE.md exists: ${discovery.claudeMdExists}. ${discovery.notes || ''}`)

if (!discovery.digest || !discovery.sessionsDigested) {
  return { error: 'No merged digest produced — nothing to mine.', discovery: { ...discovery, digest: undefined } }
}

// One shared, in-context digest for all miners. No per-miner file reads.
const DIGEST = discovery.digest
const CLAUDE_MD = discovery.claudeMd || ''

// Miners per round: a few independent passes over the SAME merged digest, differing by
// instruction (find DIFFERENT patterns than already proposed), not by input slice — so every
// miner sees every session (higher recall for cross-session patterns).
const MINERS_PER_ROUND = A.miners || Math.min(4, Math.max(2, Math.ceil(discovery.sessionsDigested / 6)))

// =========================================================================
// PHASES 2+3: MINE -> VERIFY, looped until dry. Pipelined: each round's
// candidates verify as soon as that round's miners return (no global barrier
// across rounds), and within a round verification pipelines per-candidate.
// =========================================================================
const seen = new Set()
const confirmed = []
let dry = 0
let round = 0

const minePrompt = (roundNo, knownTitles) => `You are mining recent Claude Code sessions for NON-OBVIOUS patterns worth adding to a project's CLAUDE.md.

PROJECT: ${PROJECT}

The merged session digest is provided INLINE below — read it directly, do NOT go looking for session files.
It begins with an "=== ALREADY DOCUMENTED ===" block (the current CLAUDE.md). Anything in there is
OFF-LIMITS — do not re-propose it.

ALREADY-PROPOSED THIS RUN (do NOT repeat — find DIFFERENT patterns; you are pass #${roundNo}):
${knownTitles.length ? knownTitles.map((t) => '- ' + t).join('\n') : '(nothing yet — first pass)'}

A candidate QUALIFIES only if it meets ALL of these (high bar — most things fail it):
1. NON-OBVIOUS: a competent engineer would NOT guess it from reading the code once.
2. MULTI-FILE: understanding it requires correlating 2+ files / locations. State exactly which files and the relationship.
3. NOT INFERABLE FROM STRUCTURE: not learnable from the directory tree, file names, framework conventions, package.json, or imports alone. ("uses Next.js app router" → REJECT, structural.)
4. NOT ALREADY DOCUMENTED in the current CLAUDE.md.

GOOD candidates: hidden coupling between two modules; a load-bearing ordering/sequencing constraint;
a non-local invariant two files must jointly uphold; a footgun the session hit and worked around;
a version-bump-in-two-places rule; an "X must happen before Y or Z breaks" gotcha; a convention the
sessions repeatedly enforced that isn't written down.

For each candidate:
- OPEN AND READ the actual files (filesInvolved) with Read to CONFIRM the pattern is real in the
  CURRENT code — the digest only points you to leads; live code is ground truth. Do not propose from
  session chatter alone.
- Write proposedText as the literal markdown to append to CLAUDE.md (imperative, terse, like existing lines).
- Give id as a unique kebab-case slug.

Quality over quantity. Return 0 candidates rather than weak ones. If nothing new clears the bar, return an empty list.

=== MERGED SESSION DIGEST (inline) ===
${DIGEST}
=== END DIGEST ===`

// Combined-lens adversarial verifier: ONE skeptic per candidate that runs BOTH the structure
// check and the novelty/truth check (was 2 skeptics × 2 lenses = 4 agents). Reject-by-default.
const verifyPrompt = (c) => `Adversarially challenge this proposed CLAUDE.md candidate. Your DEFAULT is to REJECT —
let it survive ONLY if you cannot break it on EITHER lens below.

PROJECT: ${PROJECT}
CURRENT CLAUDE.md path: ${discovery.claudeMdPath} (${discovery.claudeMdExists ? 'exists' : 'does not exist'})
The current CLAUDE.md text is included at the end so you do not need to re-read the file.

CANDIDATE:
  id: ${c.id}
  title: ${c.title}
  pattern: ${c.pattern}
  whyNonObvious: ${c.whyNonObvious}
  filesInvolved: ${(c.filesInvolved || []).join(', ')}
  evidence: ${c.evidence}
  proposedText: ${c.proposedText}

LENS 1 — STRUCTURE: try to prove this IS inferable from the directory tree, file names, framework
conventions, package.json, or imports. If a fresh engineer would guess it from structure alone → FAIL.
Also confirm it genuinely needs 2+ files — if one file makes it obvious → FAIL.

LENS 2 — NOVELTY + TRUTH: try to prove it is ALREADY in the current CLAUDE.md (below), OR is not
actually a real pattern in the code (OPEN filesInvolved with Read and verify against live code), OR
is unsupported by the cited evidence. Any of these → FAIL.

Open the cited files as needed. Return survives=true ONLY if the candidate withstands BOTH lenses.
Pick the failureMode that best explains a rejection (or "none" if it survives).

=== CURRENT CLAUDE.md ===
${CLAUDE_MD || '(none — file does not exist yet)'}
=== END CLAUDE.md ===`

while (round < MAX_ROUNDS && dry < DRY_ROUNDS) {
  // Budget guard: if the user set a token target and we're nearly out, stop mining gracefully
  // rather than spawning another round that can't finish. (No-op when no target is set.)
  if (budget.total && budget.remaining() < 60_000) {
    log(`Stopping early: token budget nearly exhausted (${Math.round(budget.remaining() / 1000)}k left).`)
    break
  }

  round++
  phase('Mine')
  const knownTitles = [...seen]

  // All miners read the SAME merged digest; they diverge by the "find different than X" instruction.
  const mined = await parallel(
    Array.from({ length: MINERS_PER_ROUND }, (_, i) => () =>
      agent(minePrompt(round, knownTitles), {
        phase: 'Mine',
        schema: CANDIDATE_SCHEMA,
        label: `mine r${round}.${i + 1}`,
      })
    )
  )

  const fresh = mined
    .filter(Boolean)
    .flatMap((r) => r.candidates || [])
    .filter((c) => c && c.title && !seen.has(key(c)))

  // dedup within this round too (two miners may surface the same thing)
  const deduped = []
  const roundKeys = new Set()
  for (const c of fresh) {
    const k = key(c)
    if (roundKeys.has(k)) continue
    roundKeys.add(k)
    deduped.push(c)
  }

  if (!deduped.length) {
    dry++
    log(`Round ${round}: 0 new candidates (dry streak ${dry}/${DRY_ROUNDS}).`)
    continue
  }
  dry = 0
  deduped.forEach((c) => seen.add(key(c)))
  log(`Round ${round}: ${deduped.length} new candidates → adversarial verification.`)

  // VERIFY: one combined-lens skeptic per candidate, all candidates in parallel.
  phase('Verify')
  const judged = await parallel(
    deduped.map((c) => () =>
      agent(verifyPrompt(c), { phase: 'Verify', schema: VERDICT_SCHEMA, label: `verify ${c.id}` })
        .then((v) => ({ candidate: c, survives: !!(v && v.survives), verdict: v }))
        .catch(() => ({ candidate: c, survives: false, verdict: null }))
    )
  )

  const survivors = judged.filter(Boolean).filter((j) => j.survives)
  const killed = judged.filter(Boolean).filter((j) => !j.survives)
  survivors.forEach((s) => confirmed.push(s.candidate))
  log(`Round ${round}: ${survivors.length} survived, ${killed.length} rejected. Total confirmed: ${confirmed.length}.`)
}

if (round >= MAX_ROUNDS && dry < DRY_ROUNDS) {
  log(`Stopped at MAX_ROUNDS=${MAX_ROUNDS} (still finding candidates — raise maxRounds to dig deeper).`)
}

// =========================================================================
// PHASE 4: SYNTHESIZE
// =========================================================================
phase('Synthesize')

if (!confirmed.length) {
  return {
    summary: 'No non-obvious CLAUDE.md candidates survived adversarial review.',
    projectPath: PROJECT,
    sessionsRead: discovery.sessionsDigested,
    rounds: round,
    confirmed: [],
  }
}

const report = await agent(
  `Assemble a CLAUDE.md proposal report. These candidates each survived combined-lens adversarial
review (proven non-obvious, multi-file, non-structural, not-already-documented).

PROJECT: ${PROJECT}
CURRENT CLAUDE.md: ${discovery.claudeMdPath}

SURVIVING CANDIDATES (JSON):
${JSON.stringify(confirmed, null, 2)}

Produce a clean markdown report with:
1. A one-paragraph summary (how many patterns, what kinds).
2. For each candidate: title, the pattern, why it's non-obvious, the files involved, the evidence,
   and a fenced code block with the EXACT proposedText to paste into CLAUDE.md.
3. A final "Suggested CLAUDE.md additions" section that concatenates all proposedText blocks into
   one paste-ready chunk, grouped sensibly under headings.

Do NOT modify CLAUDE.md — this is propose-only. Return the full markdown report as your final text.`,
  { phase: 'Synthesize', label: 'synthesize report' }
)

return {
  summary: `${confirmed.length} non-obvious CLAUDE.md candidate(s) survived adversarial review across ${round} round(s).`,
  projectPath: PROJECT,
  sessionsRead: discovery.sessionsDigested,
  rounds: round,
  confirmedCount: confirmed.length,
  report,
}
