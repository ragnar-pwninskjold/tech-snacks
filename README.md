# Tech Snacks

> A skill library for people that make stuff

A [Claude Code plugin](https://code.claude.com/docs/en/plugins-reference) bundling reusable skills for builders.

## Install

```bash
# In Claude Code
/plugin install ragnar-pwninskjold/tech-snacks
```

Or clone locally and point Claude Code at the directory.

## Structure

```
tech-snacks/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── skills/                      # All skills live here as peer directories
│   ├── ui-cloner/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   └── references/
│   ├── ui-cloner-brand-interview/
│   ├── ui-cloner-forensic-audit/
│   ├── ui-cloner-iterator/
│   ├── ui-cloner-quality-check/
│   └── ui-cloner-synthesis/
├── LICENSE
└── README.md
```

## Skills

- **ui-cloner** — Site Replication Intelligence Protocol (SRIP) entry point. Orchestrates the full 4-phase pipeline for cloning a target site's UI.
- **ui-cloner-forensic-audit** — Phase 1: forensic analysis of the target site, producing a Site DNA document.
- **ui-cloner-brand-interview** — Phase 2: collects the 12 brand questions.
- **ui-cloner-synthesis** — Phase 3: fuses Site DNA + brand answers into a one-shot replication prompt.
- **ui-cloner-quality-check** — Phase 4: validates the final prompt against the fidelity checklist.
- **ui-cloner-iterator** — Post-build loop for dialing in fidelity after a weak replication attempt.

## Adding a Skill

1. Create `skills/<skill-name>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does (this is what Claude reads to decide when to invoke)
   ---
   ```
2. Optionally add `scripts/`, `references/`, `assets/` alongside `SKILL.md`.
3. Skill name must match the directory (kebab-case, `^[a-z0-9]+(-[a-z0-9]+)*$`).
4. Compound skills live as peer directories in `skills/` — do not nest them.

## License

MIT — see [LICENSE](LICENSE).
