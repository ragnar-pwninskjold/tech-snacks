export const meta = {
  name: 'react-refactor-tournament',
  description: 'Review React/Next.js code against the REAL vercel-react-best-practices skill (hard preflight — aborts if the skill is not installed), backlog the findings with their rule impact, rank within over-subscribed impact tiers via a lazy tie-break ranker, then fix + test the top N. Capped at 500k output tokens per run.',
  whenToUse: 'When you want to harvest React/Next.js PERFORMANCE refactor candidates straight from the vercel-react-best-practices skill (waterfalls, bundle size, RSC fetching, re-renders, JS perf), persist a tracked backlog keyed by the skill\'s rule ids + impact tiers, rank the most over-subscribed tiers by reach×blast-radius×leverage, and auto-fix the worst N (with tests + commits). Pass args: {n?, scope?, repoPath?}. n defaults to 3; n=0 ranks only and skips the fix loop. The skill MUST be installed (project or user .claude/skills or .agents/skills) — the run aborts with an actionable message if not. Hard-capped at 500k output tokens.',
  phases: [
    { title: 'Preflight', detail: 'resolve the vercel-react-best-practices skill install path; abort if missing' },
    { title: 'Scope', detail: 'find React component areas (TSX/JSX dirs) to review' },
    { title: 'Discover', detail: 'parallel reviewers invoke the vercel-react-best-practices skill and emit rule-keyed candidates' },
    { title: 'Backlog', detail: 'dedup + assign stable IDs; orchestrator renders BACKLOG.json/.md, a dumb-writer persists them' },
    { title: 'Rank', detail: 'impact-tier order (free); a lazy tie-break ranker only re-orders over-subscribed tiers' },
    { title: 'Fix', detail: 'top N candidates fixed in isolated worktrees, with tests, each committed' },
  ],
}

// ---- args ---------------------------------------------------------------
// args.n        : how many top-ranked candidates the fix loop processes (default 3; 0 = rank only)
// args.scope    : optional glob/dir hint to constrain the review (default: auto-detect)
// args.repoPath : absolute path to the repo root (default: process cwd of the run)
// Accept args as an object OR a JSON string OR a bare number/string.
let A = args
if (typeof A === 'string') {
  const s = A.trim()
  if (s.startsWith('{')) {
    try { A = JSON.parse(s) } catch (e) { A = {} }
  } else if (/^\d+$/.test(s)) {
    A = { n: parseInt(s, 10) }
  } else {
    A = { scope: s }
  }
} else if (typeof A === 'number') {
  A = { n: A }
}
A = A || {}
const N = (A.n === 0 || A.n) ? Number(A.n) : 3
const SCOPE_HINT = A.scope || ''
const REPO_HINT = A.repoPath || ''

// The skill this workflow is built around. Reviewers MUST use it; the run aborts if it's not installed.
const SKILL_NAME = 'vercel-react-best-practices'

// ---- token budget cap ---------------------------------------------------
// Hard ceiling: this workflow must NEVER spend more than 500k output tokens,
// regardless of how it's invoked. budget.spent() tracks real output tokens
// across the whole run (shared pool), so we gate every fan-out phase on it.
// If the user passed a smaller "+Nk" turn directive, honor the tighter of the two.
const TOKEN_CAP = (() => {
  const HARD = 500_000
  return budget && budget.total ? Math.min(HARD, budget.total) : HARD
})()
// Reserve headroom so the final backlog-writer agent can still run after a phase stops early.
const RESERVE = 40_000
// Output tokens still available before we hit the cap (minus reserve).
function tokensLeft() {
  return TOKEN_CAP - budget.spent()
}
// Rough per-agent output estimates, used to bound how many parallel agents we open at once.
const EST_PER_REVIEW = 12_000     // a skill-backed reviewer over one area
const EST_PER_TIER_RANK = 3_000   // ONE lazy tie-break ranking call over a contested impact tier
const EST_PER_FIX = 60_000        // a worktree fixer that writes code + tests
log(`Token cap for this run: ${Math.round(TOKEN_CAP / 1000)}k output tokens (reserve ${RESERVE / 1000}k).`)

// Where the tracked backlog lives. Matches the project's durable-artifact convention.
const BACKLOG_DIR = '.pro-brown/refactors'
const BACKLOG_JSON = `${BACKLOG_DIR}/BACKLOG.json`
const BACKLOG_MD = `${BACKLOG_DIR}/BACKLOG.md`

// ---- schemas ------------------------------------------------------------
const PREFLIGHT_SCHEMA = {
  type: 'object',
  required: ['installed', 'probed'],
  properties: {
    installed: { type: 'boolean', description: 'True iff a SKILL.md for the skill was found at one of the probed paths' },
    skillPath: { type: 'string', description: 'Absolute path to the resolved skill DIRECTORY (the dir containing SKILL.md), or empty if not found' },
    repoPath: { type: 'string', description: 'Absolute repo root the agent resolved (pwd or the provided hint)' },
    probed: {
      type: 'array',
      description: 'The candidate SKILL.md paths that were tested, in order',
      items: { type: 'string' },
    },
  },
}

const SCOPE_SCHEMA = {
  type: 'object',
  required: ['repoPath', 'isReactProject', 'areas'],
  properties: {
    repoPath: { type: 'string', description: 'Absolute repo root path' },
    isReactProject: { type: 'boolean', description: 'Whether React/TSX components were found at all' },
    framework: { type: 'string', description: 'next | vite | cra | remix | unknown' },
    areas: {
      type: 'array',
      description: 'Disjoint directories/globs of React components to review, sized so each is a reasonable single-agent unit',
      items: {
        type: 'object',
        required: ['label', 'path', 'fileCount'],
        properties: {
          label: { type: 'string', description: 'Short human label, e.g. "src/components/dashboard"' },
          path: { type: 'string', description: 'Directory or glob the reviewer should scan' },
          fileCount: { type: 'number', description: 'Approx count of TSX/JSX files in this area' },
        },
      },
    },
    notes: { type: 'string' },
  },
}

// Candidates are now keyed to the skill's actual rules: `category` is one of the
// 8 rule-prefix families, `ruleId` is the exact rule (e.g. async-parallel), and
// `severity` is the rule's static `impact:` lowercased.
const CANDIDATE_SCHEMA = {
  type: 'object',
  required: ['candidates'],
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'file', 'category', 'ruleId', 'severity', 'rationale', 'suggestedFix'],
        properties: {
          title: { type: 'string', description: 'One-line description of the refactor' },
          file: { type: 'string', description: 'Repo-relative file path' },
          line: { type: 'number', description: 'Line number of the violation (best effort)' },
          category: {
            type: 'string',
            description: 'The vercel-react-best-practices rule FAMILY (prefix) this violation belongs to',
            enum: ['async', 'bundle', 'server', 'client', 'rerender', 'rendering', 'js', 'advanced'],
          },
          ruleId: {
            type: 'string',
            description: 'The exact skill rule id, e.g. "async-parallel", "bundle-barrel-imports", "server-parallel-fetching". Must come from the skill, not invented.',
          },
          severity: {
            type: 'string',
            enum: ['critical', 'high', 'medium', 'low'],
            description: 'The matched rule\'s `impact:` lowercased — CRITICAL→critical, HIGH/MEDIUM-HIGH→high, MEDIUM→medium, LOW/LOW-MEDIUM→low. Take it from the rule, do NOT guess.',
          },
          rationale: { type: 'string', description: 'Why this violates the named rule, citing the rule id' },
          suggestedFix: { type: 'string', description: 'Minimal fix the fixer should attempt, per the rule\'s "correct" example' },
          testable: { type: 'boolean', description: 'Whether a meaningful automated test can verify the fix' },
        },
      },
    },
  },
}

// One lazy ranking call over an over-subscribed impact tier — returns a full
// ordering of just that tier's candidate ids, best (biggest bottleneck) first.
const TIER_RANK_SCHEMA = {
  type: 'object',
  required: ['orderedIds'],
  properties: {
    orderedIds: {
      type: 'array',
      description: 'The tier\'s candidate ids, ordered biggest-bottleneck-first (reach × blast-radius × fix-leverage). Must be a permutation of exactly the ids given.',
      items: { type: 'string' },
    },
    reasons: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'why'],
        properties: {
          id: { type: 'string' },
          why: { type: 'string', description: 'One sentence: why this candidate ranks where it does' },
        },
      },
    },
  },
}

const FIX_SCHEMA = {
  type: 'object',
  required: ['id', 'status', 'summary'],
  properties: {
    id: { type: 'string' },
    status: { type: 'string', enum: ['fixed', 'partial', 'skipped', 'failed'] },
    summary: { type: 'string', description: 'What changed' },
    filesTouched: { type: 'array', items: { type: 'string' } },
    testAdded: { type: 'boolean' },
    testCommand: { type: 'string', description: 'How tests were run, if any' },
    committed: { type: 'boolean' },
    commitSha: { type: 'string' },
    notes: { type: 'string' },
  },
}

// ---- helpers ------------------------------------------------------------
// Deterministic stable id from file+title (no Math.random / Date.now allowed in scripts).
function slugId(file, title, idx) {
  const base = `${file}:${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const short = base.slice(0, 40).replace(/-+$/g, '')
  return `RF-${String(idx + 1).padStart(3, '0')}-${short}`
}

const SEV_RANK = { critical: 0, high: 1, medium: 2, low: 3 }
const TIERS = ['critical', 'high', 'medium', 'low']

// JSON-escape a single backlog .md line cell.
function mdEsc(s) {
  return String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ').trim()
}

// Render the BACKLOG.json object the dumb-writer will persist. `prior` is the
// previous candidates array (if any) so we can preserve a `status` set by an
// earlier run; merge is done HERE in the body, the writer stays dumb.
function renderBacklogJson(repo, candidates, ranking, priorById) {
  const catCounts = candidates.reduce((m, c) => ((m[c.category] = (m[c.category] || 0) + 1), m), {})
  const sevCounts = candidates.reduce((m, c) => ((m[c.severity] = (m[c.severity] || 0) + 1), m), {})
  const merged = candidates.map((c) => {
    const prev = priorById.get(c.id)
    return prev && prev.status ? { ...c, status: prev.status, fix: prev.fix } : c
  })
  // Keep prior candidates whose id vanished from this run, so history isn't lost.
  for (const [id, prev] of priorById) {
    if (!merged.some((c) => c.id === id)) merged.push(prev)
  }
  return {
    generatedBy: 'react-refactor-tournament',
    skill: SKILL_NAME,
    repo,
    summary: { total: candidates.length, byCategory: catCounts, bySeverity: sevCounts },
    ...(ranking ? { ranking } : {}),
    candidates: merged,
  }
}

// Render the human-readable BACKLOG.md.
function renderBacklogMd(repo, candidates, ranking, fixes) {
  const L = []
  L.push('# React Refactor Backlog')
  L.push('')
  L.push(`> Generated by the \`react-refactor-tournament\` workflow against the \`${SKILL_NAME}\` skill.`)
  L.push(`> Repo: \`${repo}\`. Ranking is recorded after the Rank phase; fix outcomes after the Fix phase.`)
  L.push('')
  // Summary table.
  const sevCounts = candidates.reduce((m, c) => ((m[c.severity] = (m[c.severity] || 0) + 1), m), {})
  L.push('| Metric | Count |')
  L.push('| --- | --- |')
  L.push(`| Total candidates | ${candidates.length} |`)
  for (const t of TIERS) if (sevCounts[t]) L.push(`| ${t} | ${sevCounts[t]} |`)
  L.push('')
  // Priority ranking, if present.
  if (ranking && ranking.length) {
    L.push('## Priority ranking')
    L.push('')
    ranking.forEach((r) => {
      L.push(`${r.rank}. \`${r.id}\` — ${mdEsc(r.title)} (${mdEsc(r.file)}) — severity ${r.severity}${r.ruleId ? `, rule \`${r.ruleId}\`` : ''}`)
    })
    L.push('')
  }
  // Checklist grouped by severity.
  L.push('## Candidates by severity')
  L.push('')
  for (const t of TIERS) {
    const inTier = candidates.filter((c) => c.severity === t)
    if (!inTier.length) continue
    L.push(`### ${t}`)
    L.push('')
    inTier.forEach((c) => {
      const done = c.status === 'fixed' ? 'x' : ' '
      L.push(`- [${done}] \`${c.id}\` **${mdEsc(c.title)}** — ${mdEsc(c.file)}:${c.line || '?'} _(\`${c.ruleId}\`)_ — ${mdEsc(c.rationale)}`)
    })
    L.push('')
  }
  // Last fix run.
  if (fixes && fixes.length) {
    L.push('## Last fix run')
    L.push('')
    fixes.forEach((f) => {
      L.push(`- \`${f.id}\` — **${f.status}**${f.testAdded ? ', test added' : ''}${f.commitSha ? `, commit \`${String(f.commitSha).slice(0, 8)}\`` : ''} — ${mdEsc(f.summary)}`)
    })
    L.push('')
  }
  return L.join('\n')
}

// Persist a pre-rendered JSON object + MD string via a single dumb-writer agent.
// The agent does NO reading/reasoning — it mkdir -p's and Writes exactly what it's given.
async function persistBacklog(repo, jsonObj, mdStr, labelSuffix) {
  await agent(
    `Persist two files to disk in repo ${repo}. Do NOT read, reason about, or modify the content — write it EXACTLY as given.

1. Run: mkdir -p ${BACKLOG_DIR}
2. Write ${BACKLOG_JSON} with EXACTLY this JSON (already final, pretty-print as-is):
\`\`\`json
${JSON.stringify(jsonObj, null, 2)}
\`\`\`
3. Write ${BACKLOG_MD} with EXACTLY this Markdown:
\`\`\`markdown
${mdStr}
\`\`\`

Use Bash(mkdir) + Write only. Confirm both paths were written.`,
    { label: `backlog:write:${labelSuffix}`, phase: 'Backlog' },
  )
}

// ========================================================================
// PHASE 0 — PREFLIGHT  (hard skill-install gate)
// ========================================================================
phase('Preflight')
const preflight = await agent(
  `You are verifying that the "${SKILL_NAME}" skill is installed before a workflow that depends on it runs.

1. Resolve the absolute repo root: ${REPO_HINT ? `use "${REPO_HINT}".` : 'run `pwd`.'}
2. Probe these candidate SKILL.md paths IN THIS ORDER and record each in "probed" (absolute):
   a. <repo>/.claude/skills/${SKILL_NAME}/SKILL.md
   b. <repo>/.agents/skills/${SKILL_NAME}/SKILL.md
   c. $HOME/.claude/skills/${SKILL_NAME}/SKILL.md
   d. $HOME/.agents/skills/${SKILL_NAME}/SKILL.md
   Use \`test -f <path> && echo FOUND\` (read-only). A symlink that resolves to a real SKILL.md counts as found.
3. Set installed=true and skillPath=<the DIRECTORY containing the first SKILL.md that exists> for the FIRST match.
   If none exist, installed=false and skillPath="".
4. Return the structured result. Do not edit anything.`,
  { label: 'preflight:resolve-skill', phase: 'Preflight', schema: PREFLIGHT_SCHEMA, agentType: 'Explore' },
)

if (!preflight || !preflight.installed) {
  const probed = (preflight && preflight.probed) || []
  log(`❌ The "${SKILL_NAME}" skill is NOT installed. Probed:\n  - ${probed.join('\n  - ') || '(none)'}`)
  log(`Install it into the project (.claude/skills/${SKILL_NAME}) or your user scope (~/.claude/skills/${SKILL_NAME}) and re-run. This workflow refuses to run with a hand-written stand-in.`)
  return { aborted: true, reason: 'skill-not-installed', probed }
}
const SKILL_PATH = preflight.skillPath
const PREFLIGHT_REPO = preflight.repoPath
log(`✅ Skill resolved: ${SKILL_NAME} @ ${SKILL_PATH}`)

// ========================================================================
// PHASE 1 — SCOPE
// ========================================================================
phase('Scope')
const scope = await agent(
  `You are scoping a React codebase for a refactor review.
Repo root: ${REPO_HINT || PREFLIGHT_REPO || 'the current working directory (resolve it with \`pwd\`)'}.
${SCOPE_HINT ? `The user constrained scope to: "${SCOPE_HINT}". Honor it.` : ''}

Tasks:
1. Resolve the absolute repo root.
2. Detect whether this is a React project (look for react in package.json deps, *.tsx/*.jsx files). Detect framework.
3. Enumerate the directories that contain React components. Group them into DISJOINT review "areas",
   each sized as a sensible unit for a single reviewer (roughly 5-25 component files). Prefer feature/route
   directories (e.g. src/components/<feature>, app/<route>). Give each area a glob or dir path and approx file count.
4. If it is NOT a React project, set isReactProject=false and return an empty areas array with a note.

Use ls/find/grep (read-only). Do not edit anything. Return the structured result.`,
  { label: 'scope:react-areas', phase: 'Scope', schema: SCOPE_SCHEMA, agentType: 'Explore' },
)

if (!scope || !scope.isReactProject || !scope.areas || scope.areas.length === 0) {
  log(`No React component areas found${scope?.notes ? ` — ${scope.notes}` : ''}. Nothing to do.`)
  return { aborted: true, reason: 'no-react-areas', scope }
}

const REPO = scope.repoPath
log(`Scoped ${scope.areas.length} React area(s) in ${REPO} (${scope.framework || 'unknown'} framework).`)

// ========================================================================
// PHASE 2 — DISCOVER  (parallel reviewers, each invoking the real skill)
// ========================================================================
phase('Discover')
// Cap how many areas we review so Discover can't blow the budget on a huge repo.
// Leave room for at least the rank + fix + writer phases (RESERVE handles the writer).
const reviewBudget = Math.max(0, tokensLeft() - RESERVE - EST_PER_FIX * Math.max(0, N))
const maxReviews = Math.max(1, Math.floor(reviewBudget / EST_PER_REVIEW))
const reviewAreas = scope.areas.slice(0, maxReviews)
if (reviewAreas.length < scope.areas.length) {
  log(`Budget cap: reviewing ${reviewAreas.length}/${scope.areas.length} area(s) to stay under ${Math.round(TOKEN_CAP / 1000)}k tokens (skipping ${scope.areas.length - reviewAreas.length}).`)
}
const discoveries = await parallel(
  reviewAreas.map((area) => () =>
    agent(
      `You are a React/Next.js performance reviewer. Review ONLY the React components under this area:
  label: ${area.label}
  path:  ${area.path}
  (~${area.fileCount} files)

FIRST: invoke the "${SKILL_NAME}" skill (use the Skill tool — it is installed and verified). The skill is at
${SKILL_PATH} — you may Read ${SKILL_PATH}/SKILL.md for the rule index and Read individual ${SKILL_PATH}/rules/<rule-id>.md
files for detail on any rule you're matching against. Apply the skill's rules — these are PERFORMANCE rules
(async/waterfalls, bundle size, server/RSC fetching, client fetching, re-renders, rendering, JS perf, advanced).

Then read the relevant .tsx/.jsx files (Read/Grep/Glob; read-only — do NOT edit). For each genuine violation
of a SPECIFIC skill rule, emit one candidate and set:
  - ruleId   = the exact skill rule id (e.g. "async-parallel", "bundle-barrel-imports", "server-parallel-fetching")
  - category = that rule's family/prefix (async|bundle|server|client|rerender|rendering|js|advanced)
  - severity = that rule's \`impact:\` lowercased (CRITICAL→critical, HIGH/MEDIUM-HIGH→high, MEDIUM→medium, LOW/LOW-MEDIUM→low)
  - rationale/suggestedFix = grounded in the rule's incorrect/correct examples

Be specific and conservative: only flag real violations you can point to a file+line for, and only against an
ACTUAL rule in the skill — do NOT invent rules or flag generic hygiene the skill doesn't cover. Do not pad to a
quota. Set testable=true only when a real automated test (unit/RTL/integration) could verify the fix.`,
      { label: `review:${area.label}`, phase: 'Discover', schema: CANDIDATE_SCHEMA, agentType: 'Explore' },
    ),
  ),
)

// Flatten + dedup by file+title, assign stable ids.
const seen = new Set()
const candidates = []
discoveries
  .filter(Boolean)
  .flatMap((d) => d.candidates || [])
  .forEach((c) => {
    const key = `${(c.file || '').toLowerCase()}::${(c.title || '').toLowerCase()}`
    if (seen.has(key)) return
    seen.add(key)
    const idx = candidates.length
    candidates.push({ id: slugId(c.file || 'unknown', c.title || 'untitled', idx), ...c })
  })

if (candidates.length === 0) {
  log(`Reviewers found no ${SKILL_NAME} violations. Codebase looks clean against the skill's rules.`)
  return { candidates: [], ranking: [], fixes: [] }
}
log(`Collected ${candidates.length} unique candidate(s) across ${reviewAreas.length} area(s), keyed to skill rules.`)

// ========================================================================
// PHASE 3 — BACKLOG  (orchestrator renders; one dumb-writer persists)
// ========================================================================
phase('Backlog')
const byId = new Map(candidates.map((c) => [c.id, c]))
// We don't read prior backlog from disk in-body (no FS access); the writer overwrites.
// Merge-of-prior-status would require reading first — out of scope for this pass.
const priorById = new Map()
await persistBacklog(REPO, renderBacklogJson(REPO, candidates, null, priorById), renderBacklogMd(REPO, candidates, null, null), 'initial')
log(`Backlog written → ${BACKLOG_JSON} + ${BACKLOG_MD}`)

if (N <= 0) {
  log('n=0 → ranking-only mode; fix loop will be skipped after ranking.')
}

// ========================================================================
// PHASE 4 — RANK  (impact-tier order is free; lazy tie-break only for contested tiers)
// ========================================================================
phase('Rank')

// Baseline: order by impact tier (from the skill) then stable id. No agents.
let ordered = [...candidates].sort(
  (a, b) => (SEV_RANK[a.severity] - SEV_RANK[b.severity]) || a.id.localeCompare(b.id),
)

// How many fix slots could plausibly reach into the field. For n=0 (rank-only)
// we still tie-break the top tier so the recorded ranking is meaningful, using a
// small default cutoff.
const fixSlots = N > 0 ? N : 3

// Walk tiers top-down. A tier is "contested" when it's within reach of the fix
// cutoff AND has more members than the slots still unfilled when we reach it —
// i.e. ordering WITHIN the tier actually changes which candidates get fixed.
// Only those tiers get a single ranking call; everything else stays in seed order.
const tierGroups = TIERS
  .map((t) => ({ tier: t, ids: ordered.filter((c) => c.severity === t).map((c) => c.id) }))
  .filter((g) => g.ids.length > 0)

let filled = 0
const rankedIds = []
let tierRankCalls = 0
for (const g of tierGroups) {
  const slotsRemaining = Math.max(0, fixSlots - filled)
  const contested = slotsRemaining > 0 && g.ids.length > slotsRemaining
  // Budget gate: only spend on a tie-break if we can afford it and still fix.
  const canAfford = tokensLeft() - RESERVE - EST_PER_FIX * Math.max(0, N) >= EST_PER_TIER_RANK

  if (contested && canAfford) {
    const tierCandidates = g.ids.map((id) => byId.get(id))
    const blurbs = tierCandidates
      .map((c) => `- id=${c.id} | rule=${c.ruleId} | ${c.file}:${c.line || '?'} | ${c.title}\n    why: ${c.rationale}\n    fix: ${c.suggestedFix}`)
      .join('\n')
    const res = await agent(
      `These ${tierCandidates.length} React/Next.js performance refactor candidates ALL share the same impact tier
("${g.tier}", from the vercel-react-best-practices skill). The static tier can't tell them apart, but only
${slotsRemaining} fix slot(s) remain — so order them by which is the BIGGER bottleneck to fix FIRST.

"Bigger bottleneck" = reach (how many users/pages/components feel it) × blast radius (how much it costs when
left) × fix leverage (does fixing it unblock or obviate others). A waterfall in a root layout beats one in a
rarely-opened modal even though both are "${g.tier}".

Candidates:
${blurbs}

Return orderedIds = exactly these ids, biggest-bottleneck-first (a permutation of the given ids), with a
one-sentence reason per id.`,
      { label: `rank:${g.tier}`, phase: 'Rank', schema: TIER_RANK_SCHEMA },
    )
    tierRankCalls++
    // Apply the returned order, but defensively keep any ids the agent dropped/duplicated.
    const valid = (res && Array.isArray(res.orderedIds)) ? res.orderedIds.filter((id) => g.ids.includes(id)) : []
    const finalOrder = [...new Set(valid)]
    for (const id of g.ids) if (!finalOrder.includes(id)) finalOrder.push(id)
    rankedIds.push(...finalOrder)
  } else {
    // Uncontested (or unaffordable): seed order within the tier — zero agent calls.
    rankedIds.push(...g.ids)
  }
  filled += g.ids.length
}
log(`Rank: ${tierRankCalls} tie-break call(s) over contested tier(s); the rest by skill impact tier (free).`)

const ranking = rankedIds.map((id, i) => {
  const c = byId.get(id)
  return { rank: i + 1, id, severity: c.severity, ruleId: c.ruleId, title: c.title, file: c.file }
})

// Persist ranking into the backlog (re-render both files with ranking now present).
await persistBacklog(REPO, renderBacklogJson(REPO, candidates, ranking, priorById), renderBacklogMd(REPO, candidates, ranking, null), 'ranked')
log(`Ranking written. Top: ${ranking.slice(0, 3).map((r) => r.id).join(', ')}`)

if (N <= 0) {
  return { repo: REPO, skill: { name: SKILL_NAME, path: SKILL_PATH }, backlog: { json: BACKLOG_JSON, md: BACKLOG_MD }, candidateCount: candidates.length, ranking, fixes: [] }
}

// ========================================================================
// PHASE 5 — FIX LOOP  (top N, isolated worktrees, tests where possible, commit each)
// ========================================================================
phase('Fix')
// Bound the number of worktree fixers by the remaining budget — these are the most
// expensive agents, so this is the last and hardest line of defense on the 500k cap.
const fixAffordable = Math.max(0, Math.floor((tokensLeft() - RESERVE) / EST_PER_FIX))
const fixCount = Math.min(N, ranking.length, fixAffordable)
const targets = ranking.slice(0, fixCount).map((r) => byId.get(r.id))
if (fixCount < Math.min(N, ranking.length)) {
  log(`Budget cap: fixing top ${fixCount} (not ${Math.min(N, ranking.length)}) to stay under ${Math.round(TOKEN_CAP / 1000)}k tokens. Remaining candidates stay in the backlog for a later run.`)
}
if (targets.length === 0) {
  log('Budget cap reached before the fix phase — ranking-only this run. Re-run the workflow to fix the top candidates from the backlog.')
  return { repo: REPO, skill: { name: SKILL_NAME, path: SKILL_PATH }, backlog: { json: BACKLOG_JSON, md: BACKLOG_MD }, candidateCount: candidates.length, ranking, fixes: [], note: 'Stopped at ranking to respect the 500k token cap.' }
}
log(`Fixing top ${targets.length} of ${ranking.length} ranked candidate(s) (n=${N}).`)

const fixes = await parallel(
  targets.map((c, i) => () =>
    agent(
      `Fix ONE React/Next.js performance refactor candidate, in an isolated git worktree, with test-driven discipline where possible.

This candidate is a violation of the "${SKILL_NAME}" skill rule \`${c.ruleId}\`. Read ${SKILL_PATH}/rules/${c.ruleId}.md
for the canonical incorrect→correct transformation before you touch code, and follow it.

Candidate (rank ${i + 1}):
  id:        ${c.id}
  title:     ${c.title}
  rule:      ${c.ruleId} (family: ${c.category}, impact: ${c.severity})
  file:      ${c.file}${c.line ? `:${c.line}` : ''}
  rationale: ${c.rationale}
  suggested: ${c.suggestedFix}
  testable:  ${c.testable === true}

Rules:
- You are already running in a fresh, isolated worktree of repo ${REPO}. Make your changes here only.
- Apply the MINIMAL fix that resolves THIS rule violation — do not refactor beyond what the rule requires.
  One concern: this candidate only.
- Tests: if testable (or you can reasonably make it so), FIRST write a failing test that captures the
  defect/behavior, confirm it fails, then make it pass. Use the project's existing test runner/conventions
  (detect from package.json: vitest/jest + @testing-library/react, etc.). If the project has NO test setup
  or a meaningful test is genuinely infeasible, say so in notes and skip the test rather than scaffolding a
  whole framework.
- Run the test command (and a typecheck/lint if the project has one) and confirm green before committing.
- Commit your change on the current branch with a descriptive message:
  "perf(react): <title> [${c.id}]" plus a body naming the skill rule (${c.ruleId}) and whether a test was added.
  Do NOT push. Capture the commit sha.
- If the fix turns out to be wrong, risky, or the candidate was a false positive on closer inspection,
  set status=skipped/failed and explain — do not force a bad change.

Return the structured result (status, files touched, whether a test was added, the test command, committed + sha, notes).`,
      { label: `fix:${c.id}`, phase: 'Fix', schema: FIX_SCHEMA, isolation: 'worktree' },
    ).then((f) => f || { id: c.id, status: 'failed', summary: 'agent returned no result', committed: false }),
  ),
)

const cleanFixes = fixes.filter(Boolean)

// Record fix outcomes: stamp status onto candidates in-body, re-render, persist via the dumb-writer.
const fixById = new Map(cleanFixes.map((f) => [f.id, f]))
const candidatesWithStatus = candidates.map((c) => {
  const f = fixById.get(c.id)
  if (!f) return c
  return { ...c, status: f.status, fix: { committed: f.committed, commitSha: f.commitSha, testAdded: f.testAdded, summary: f.summary, notes: f.notes } }
})
await persistBacklog(
  REPO,
  renderBacklogJson(REPO, candidatesWithStatus, ranking, new Map()),
  renderBacklogMd(REPO, candidatesWithStatus, ranking, cleanFixes),
  'fixes',
)

const fixedCount = cleanFixes.filter((f) => f.status === 'fixed').length
log(`Fix loop done: ${fixedCount}/${cleanFixes.length} fixed (each in its own worktree branch). Review branches, then merge/PR.`)

return {
  repo: REPO,
  skill: { name: SKILL_NAME, path: SKILL_PATH },
  backlog: { json: BACKLOG_JSON, md: BACKLOG_MD },
  candidateCount: candidates.length,
  ranking,
  fixes: cleanFixes,
  note: 'Fixes live on isolated worktree branches (committed, not pushed, not merged). Inspect with `git worktree list` and `git branch`.',
}
