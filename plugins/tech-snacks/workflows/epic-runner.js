export const meta = {
  name: 'epic-runner',
  description: 'Run every remaining epic in a directory through opsx propose → apply (subagent per phase + adversarial pass) → verify → archive/sync',
  whenToUse: 'When an epics directory (numbered NN-*.md files with change-id frontmatter) should be implemented sequentially through the full OpenSpec lifecycle, fully autonomously.',
  phases: [
    { title: 'Discover', detail: 'scan the epics dir, skip change-ids already archived' },
    { title: 'Propose', detail: 'opsx:propose per epic — artifacts + phased tasks.md' },
    { title: 'Apply', detail: 'implementer subagent per phase, adversarial review/fix loop after each' },
    { title: 'Verify', detail: 'opsx:verify with capped fix-and-reverify cycles' },
    { title: 'Finalize', detail: 'sync delta specs to main specs, archive the change' },
  ],
}

// args: { epicsDir: "docs/planning/epics" } or a plain string path
const epicsDir = (typeof args === 'string' && args) || (args && args.epicsDir) || 'docs/planning/epics'

const MAX_ADVERSARIAL_ROUNDS = 3
const MAX_VERIFY_FIX_CYCLES = 2

const SKILL_NOTE = `Invoke the named skill with the Skill tool and follow its instructions exactly. If the Skill tool is unavailable in your session, locate the skill's SKILL.md on disk (search .claude/skills, ~/.claude/skills, and installed plugin skill dirs for the opsx/openspec skill of that name), read it, and follow it.`

const COMMIT_GATE = `Commit gate: immediately before EVERY commit run \`npx tsc --noEmit\` and \`npx jest --passWithNoTests\`; both must exit 0. If either fails, fix the problem before committing — never commit red, never skip the gate, never use --no-verify. Stage files explicitly by path (never \`git add -A\` or \`git add .\` — the tree may hold unrelated files; leave anything you didn't change alone). Commit messages: conventional commits scoped to the change-id, e.g. "feat(<change-id>): <what the task delivered>". Never push, never amend or rebase existing commits.`

const DISCOVERY_SCHEMA = {
  type: 'object', required: ['epics'],
  properties: {
    epics: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'changeId', 'title', 'order', 'done', 'dependsOn'],
        properties: {
          file: { type: 'string' }, changeId: { type: 'string' }, title: { type: 'string' },
          order: { type: 'number' }, done: { type: 'boolean' },
          dependsOn: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
}

const PROPOSE_SCHEMA = {
  type: 'object', required: ['changeId', 'phases', 'blocked'],
  properties: {
    changeId: { type: 'string' },
    phases: {
      type: 'array',
      items: {
        type: 'object', required: ['number', 'title'],
        properties: { number: { type: 'number' }, title: { type: 'string' } },
      },
    },
    blocked: { type: 'boolean' }, blockReason: { type: 'string' },
  },
}

const IMPLEMENT_SCHEMA = {
  type: 'object', required: ['baseSha', 'commits', 'tasksCompleted', 'blocked'],
  properties: {
    baseSha: { type: 'string' },
    commits: {
      type: 'array',
      items: {
        type: 'object', required: ['sha', 'message'],
        properties: { sha: { type: 'string' }, message: { type: 'string' } },
      },
    },
    tasksCompleted: { type: 'number' },
    blocked: { type: 'boolean' }, blockReason: { type: 'string' },
  },
}

const REVIEW_SCHEMA = {
  type: 'object', required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object', required: ['title', 'file', 'detail', 'failureScenario', 'confirmed'],
        properties: {
          title: { type: 'string' }, file: { type: 'string' }, detail: { type: 'string' },
          failureScenario: { type: 'string' }, confirmed: { type: 'boolean' },
        },
      },
    },
  },
}

const FIX_SCHEMA = {
  type: 'object', required: ['commits', 'addressed', 'couldNotFix'],
  properties: {
    commits: {
      type: 'array',
      items: {
        type: 'object', required: ['sha', 'message'],
        properties: { sha: { type: 'string' }, message: { type: 'string' } },
      },
    },
    addressed: { type: 'array', items: { type: 'string' } },
    couldNotFix: {
      type: 'array',
      items: {
        type: 'object', required: ['title', 'reason'],
        properties: { title: { type: 'string' }, reason: { type: 'string' } },
      },
    },
  },
}

const VERIFY_SCHEMA = {
  type: 'object', required: ['passed', 'issues'],
  properties: { passed: { type: 'boolean' }, issues: { type: 'array', items: { type: 'string' } } },
}

const FINALIZE_SCHEMA = {
  type: 'object', required: ['archived', 'synced'],
  properties: { archived: { type: 'boolean' }, synced: { type: 'boolean' }, notes: { type: 'string' } },
}

function halted(reason, completed) {
  log(`HALTED: ${reason}`)
  return { status: 'halted', reason, completed }
}

// ---------- Discover ----------
phase('Discover')
const discovery = await agent(
  `Scan the epics directory "${epicsDir}" in this repo.
1. List files matching NN-*.md (a two-digit numeric prefix). Ignore README, qa-log, and anything unnumbered.
2. For each, read the YAML frontmatter: change-id, title, depends-on (list of change-ids, may be empty).
3. List the directories in openspec/changes/archive/. An epic is done if its change-id already appears there (archive dir names may carry a date prefix — match on the change-id substring).
Return every epic with: file (basename), changeId, title, order (the numeric prefix as a number), done (boolean), dependsOn (array of change-id strings).`,
  { label: 'discover-epics', schema: DISCOVERY_SCHEMA, effort: 'low' }
)
if (!discovery) return halted('discovery agent failed', [])

const remaining = discovery.epics.filter(e => !e.done).sort((a, b) => a.order - b.order)
const doneIds = new Set(discovery.epics.filter(e => e.done).map(e => e.changeId))
log(`${discovery.epics.length} epics found, ${doneIds.size} already archived, ${remaining.length} to run: ${remaining.map(e => e.changeId).join(', ') || 'none'}`)
if (remaining.length === 0) return { status: 'nothing-to-do', completed: [] }

const completed = []

for (const epic of remaining) {
  const tag = `E${String(epic.order).padStart(2, '0')}`
  const epicPath = `${epicsDir}/${epic.file}`

  const missingDeps = (epic.dependsOn || []).filter(d => !doneIds.has(d))
  if (missingDeps.length) return halted(`${tag} (${epic.changeId}) depends on unfinished change(s): ${missingDeps.join(', ')}`, completed)

  // ---------- Propose ----------
  phase('Propose')
  log(`${tag}: proposing ${epic.changeId}`)
  const proposal = await agent(
    `You are the PROPOSE stage of an automated epic pipeline. Epic file: ${epicPath}. Required change-id: "${epic.changeId}".
1. Read the epic file fully. It is the scope contract — its "Out of scope (do NOT build)" section is binding on the whole pipeline.
2. ${SKILL_NOTE} Skill: "opsx:propose". Create the OpenSpec change with change-id exactly "${epic.changeId}" and generate ALL artifacts (proposal, design if warranted, spec deltas, tasks.md) under openspec/changes/${epic.changeId}/.
3. tasks.md MUST be organized into numbered implementation phases (\`## 1. <name>\` headings with checkbox tasks under each). Each phase must be a coherent, independently implementable and reviewable slice, ordered so earlier phases never depend on later ones. This structure drives the rest of the automation.
4. Write NO application code.
5. When the artifacts are complete, make ONE commit containing only the new change artifacts: "spec(${epic.changeId}): propose change artifacts". Stage the artifact files explicitly by path; never git add -A. Never push.
Return: changeId, the ordered phase list exactly as it appears in tasks.md (number + title), blocked=false — or blocked=true with blockReason if the epic file is missing, contradictory, or the change already exists in an unexpected state.`,
    { label: `propose:${epic.changeId}`, schema: PROPOSE_SCHEMA }
  )
  if (!proposal) return halted(`${tag} propose agent failed`, completed)
  if (proposal.blocked) return halted(`${tag} propose blocked: ${proposal.blockReason || 'no reason given'}`, completed)
  if (!proposal.phases.length) return halted(`${tag} propose produced no implementation phases`, completed)
  log(`${tag} proposed: ${proposal.phases.length} phase(s)`)

  const epicCommits = []

  // ---------- Apply: one implementer subagent per phase, adversarial pass after each ----------
  phase('Apply')
  for (const ph of proposal.phases) {
    log(`${tag}: applying phase ${ph.number}/${proposal.phases.length} ("${ph.title}")`)
    const impl = await agent(
      `You are the IMPLEMENTER for phase ${ph.number} ("${ph.title}") of OpenSpec change "${epic.changeId}" (epic: ${epicPath}).
1. First record the current HEAD (\`git rev-parse HEAD\`) — return it as baseSha.
2. ${SKILL_NOTE} Skill: "opsx:apply". Read every artifact in openspec/changes/${epic.changeId}/ before writing code.
3. Implement ONLY the checkbox tasks under phase ${ph.number} in tasks.md, in order. Do not touch tasks from other phases. The epic's "Out of scope" section is absolute.
4. Work task-atomically: complete a task, mark it [x] in tasks.md, then make ONE commit containing exactly that task's changes plus the tasks.md tick. ${COMMIT_GATE}
5. If a task is impossible or the artifacts contradict each other, stop and return blocked=true with blockReason instead of improvising around it.
Return: baseSha, commits ({sha, message} each), tasksCompleted, blocked, blockReason.`,
      { label: `implement:${tag}-p${ph.number}`, schema: IMPLEMENT_SCHEMA }
    )
    if (!impl) return halted(`${tag} phase ${ph.number} implementer failed`, completed)
    if (impl.blocked) return halted(`${tag} phase ${ph.number} blocked: ${impl.blockReason || 'no reason given'}`, completed)
    epicCommits.push(...impl.commits)
    log(`${tag} phase ${ph.number} implemented: ${impl.tasksCompleted} task(s), ${impl.commits.length} commit(s)`)

    // Adversarial review → fix loop, capped
    let cleared = false
    for (let round = 1; round <= MAX_ADVERSARIAL_ROUNDS; round++) {
      const review = await agent(
        `You are an ADVERSARIAL REVIEWER. Phase ${ph.number} ("${ph.title}") of OpenSpec change "${epic.changeId}" was just implemented (review round ${round}).
Diff under review: \`git diff ${impl.baseSha}..HEAD\` and \`git log --oneline ${impl.baseSha}..HEAD\`. Ground truth: the artifacts in openspec/changes/${epic.changeId}/ and the epic file ${epicPath}.
Actively try to break this implementation:
- Construct concrete failure scenarios (specific inputs/state → wrong behavior or crash) for the changed code.
- Verify every task ticked [x] for this phase is genuinely implemented, not stubbed.
- Check the code matches the spec deltas, including the edge cases the specs name.
- Check the tests assert real behavior — would they catch the failures you hypothesized?
- Check scope: nothing built from "Out of scope" or from later phases.
Report ONLY defects that justify blocking the phase: real bugs, spec mismatches, ticked-but-unimplemented tasks, meaningless tests, scope violations. No style nits or preferences. Set confirmed=true ONLY for findings you verified by reading the code, with a concrete failureScenario; use confirmed=false for suspicions you could not verify.
Do not modify any files. Return findings (empty array if the phase holds).`,
        { label: `review:${tag}-p${ph.number}-r${round}`, schema: REVIEW_SCHEMA }
      )
      if (!review) return halted(`${tag} phase ${ph.number} adversarial reviewer failed (round ${round})`, completed)
      const confirmed = review.findings.filter(f => f.confirmed)
      if (!confirmed.length) {
        cleared = true
        log(`${tag} phase ${ph.number} cleared adversarial review (round ${round})`)
        break
      }
      log(`${tag} phase ${ph.number} round ${round}: ${confirmed.length} confirmed finding(s)`)
      if (round === MAX_ADVERSARIAL_ROUNDS) break

      const fix = await agent(
        `You are the FIXER for phase ${ph.number} ("${ph.title}") of OpenSpec change "${epic.changeId}". Confirmed findings from adversarial review:
${JSON.stringify(confirmed, null, 2)}
For each finding: first reproduce/verify the claim yourself (a reviewer can be wrong — if a finding is actually invalid, do NOT "fix" working code; put it in couldNotFix with your evidence). Then fix it. One commit per logical fix, message "fix(${epic.changeId}): <what was wrong>". ${COMMIT_GATE}
Stay inside this phase's scope; do not implement new tasks.
Return: commits, addressed (finding titles fixed), couldNotFix ({title, reason}).`,
        { label: `fix:${tag}-p${ph.number}-r${round}`, schema: FIX_SCHEMA }
      )
      if (!fix) return halted(`${tag} phase ${ph.number} fixer failed (round ${round})`, completed)
      epicCommits.push(...fix.commits)
    }
    if (!cleared) return halted(`${tag} phase ${ph.number} still has confirmed adversarial findings after ${MAX_ADVERSARIAL_ROUNDS} rounds`, completed)
  }

  // ---------- Verify → fix loop, capped ----------
  phase('Verify')
  let verified = false
  for (let attempt = 0; attempt <= MAX_VERIFY_FIX_CYCLES; attempt++) {
    const verify = await agent(
      `You are the VERIFY stage for OpenSpec change "${epic.changeId}". ${SKILL_NOTE} Skill: "opsx:verify".
Validate the implementation is complete, correct, and coherent against every artifact in openspec/changes/${epic.changeId}/ (all tasks [x] and genuinely done, spec deltas implemented, no scope creep vs the epic file ${epicPath}). Also run \`npx tsc --noEmit\` and \`npx jest --passWithNoTests\` as a final gate.
Do not modify any files. Return passed, plus issues[] — each issue a single actionable sentence (empty if passed).`,
      { label: `verify:${epic.changeId}-a${attempt + 1}`, schema: VERIFY_SCHEMA }
    )
    if (!verify) return halted(`${tag} verify agent failed`, completed)
    if (verify.passed) { verified = true; break }
    log(`${tag} verify attempt ${attempt + 1} failed: ${verify.issues.length} issue(s)`)
    if (attempt === MAX_VERIFY_FIX_CYCLES) break

    const fix = await agent(
      `You are the FIXER for OpenSpec change "${epic.changeId}". opsx verify failed with these issues:
${JSON.stringify(verify.issues, null, 2)}
Resolve each one (code or artifact, whichever is actually wrong — but never weaken a spec just to make verification pass; if an issue is invalid, put it in couldNotFix with evidence). One commit per logical fix, message "fix(${epic.changeId}): <what was wrong>". ${COMMIT_GATE}
Return: commits, addressed, couldNotFix.`,
      { label: `verify-fix:${epic.changeId}-a${attempt + 1}`, schema: FIX_SCHEMA }
    )
    if (!fix) return halted(`${tag} verify-fixer failed`, completed)
    epicCommits.push(...fix.commits)
  }
  if (!verified) return halted(`${tag} (${epic.changeId}) failed opsx verify after ${MAX_VERIFY_FIX_CYCLES} fix cycle(s) — change left unarchived for manual pickup`, completed)

  // ---------- Archive + sync ----------
  phase('Finalize')
  const fin = await agent(
    `FINALIZE OpenSpec change "${epic.changeId}" — verification has passed. ${SKILL_NOTE}
1. Sync the change's delta specs into the main specs (skill "opsx:sync") and archive the change (skill "opsx:archive"), in whichever order those skills require — if the archive skill already performs the spec sync, one step is fine, but confirm main specs under openspec/specs/ actually reflect the deltas before finishing.
2. Commit the resulting spec updates and archive move as one commit: "chore(${epic.changeId}): archive change and sync specs". Stage files explicitly by path. Never push.
Return: archived, synced, notes.`,
    { label: `finalize:${epic.changeId}`, schema: FINALIZE_SCHEMA }
  )
  if (!fin) return halted(`${tag} finalize agent failed`, completed)
  if (!fin.archived || !fin.synced) return halted(`${tag} finalize incomplete (archived=${fin.archived}, synced=${fin.synced}): ${fin.notes || ''}`, completed)

  doneIds.add(epic.changeId)
  completed.push({ epic: epic.file, changeId: epic.changeId, phases: proposal.phases.length, commits: epicCommits.length })
  log(`${tag} (${epic.changeId}) complete: ${epicCommits.length} commit(s). ${remaining.length - completed.length} epic(s) left.`)
}

return { status: 'complete', completed }
