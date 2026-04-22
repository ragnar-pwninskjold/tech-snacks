# Tech Snacks

> A skill library for people that make stuff

A [Claude Code plugin](https://code.claude.com/docs/en/plugins-reference) bundling reusable skills for builders.

## Install

```bash
# In Claude Code
/plugin install seankochel/tech-snacks
```

Or clone locally and point Claude Code at the directory.

## Structure

```
tech-snacks/
├── .claude-plugin/
│   └── plugin.json      # Plugin manifest
├── skills/              # Individual skills
│   └── ui-cloner/
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
├── LICENSE
└── README.md
```

## Skills

- **ui-cloner** — scaffold / placeholder

## Adding a Skill

1. Create `skills/<skill-name>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does
   ---
   ```
2. Optionally add `scripts/`, `references/`, `assets/`.
3. Skill name must match the directory (kebab-case, `^[a-z0-9]+(-[a-z0-9]+)*$`).

## License

MIT — see [LICENSE](LICENSE).
