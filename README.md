# Tech Snacks

> A skill library for people that make stuff

A [Claude Code plugin](https://code.claude.com/docs/en/plugins-reference) bundling reusable skills for builders.

## Install

```bash
# In Claude Code
/plugin marketplace add ragnar-pwninskjold/tech-snacks
/plugin install tech-snacks@tech-snacks
```

Or clone locally and point Claude Code at the directory.

## Structure

```
tech-snacks/
├── .claude-plugin/
│   └── marketplace.json         # Marketplace catalog (for /plugin marketplace add)
├── plugins/
│   └── tech-snacks/             # The plugin itself
│       ├── .claude-plugin/
│       │   └── plugin.json      # Plugin manifest
│       └── skills/              # All skills live here as peer directories
│           ├── ui-cloner/
│           │   ├── SKILL.md
│           │   ├── references/  # Phase-by-phase procedures
│           │   ├── templates/   # Canonical output artifact shapes
│           │   └── examples/    # Worked examples for high-fidelity blocks
│           └── prd-to-ux/
│               ├── SKILL.md
│               ├── references/
│               └── templates/
├── LICENSE
└── README.md
```

## Skills

- **ui-cloner** — Site Replication Intelligence Protocol (SRIP). Full 4-phase pipeline for cloning a target site's UI: forensic audit → brand interview → synthesis → quality check, plus a post-build iterator for dialing in fidelity. Each phase is defined by an internal reference file under `references/`, with output shapes in `templates/` and worked examples in `examples/`.
- **prd-to-ux** — translate a PRD or product idea into tool-agnostic screen prompts for web UX generators (Stitch, Figma AI, Pencil, Claude Design).
- **scaffold-claude** — interview the user to scaffold a project-level CLAUDE.md / AGENTS.md, capturing edge cases and tribal knowledge.
- **intent-layer** — set up hierarchical AGENTS.md infrastructure so agents navigate codebases like senior engineers. _Vendored from [crafter-station/skills](https://github.com/crafter-station/skills/tree/main/context-engineering/intent-layer) — see [Credits](#credits)._

## Adding a Skill

1. Create `plugins/tech-snacks/skills/<skill-name>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does (this is what Claude reads to decide when to invoke)
   ---
   ```
2. Optionally add `scripts/`, `references/`, `assets/` alongside `SKILL.md`.
3. Skill name must match the directory (kebab-case, `^[a-z0-9]+(-[a-z0-9]+)*$`).
4. Compound skills live as peer directories in `plugins/tech-snacks/skills/` — do not nest them.

## Credits

- **intent-layer** is vendored from [crafter-station/skills](https://github.com/crafter-station/skills/tree/main/context-engineering/intent-layer) (MIT, © 2026 Crafter Station). Built by [Railly Hugo](https://railly.dev) for [Crafter Station](https://crafterstation.com), based on [The Intent Layer](https://www.intent-systems.com/learn/intent-layer) by Tyler Brandt. Its upstream license is preserved at `plugins/tech-snacks/skills/intent-layer/LICENSE`.

## License

MIT — see [LICENSE](LICENSE). Vendored skills retain their original licenses alongside their source (see [Credits](#credits)).
