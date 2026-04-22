---
name: ui-cloner
description: Placeholder skill scaffolded from the template. Replace with the actual ui-cloner workflow.
metadata:
  category: template
  difficulty: beginner
  version: 0.1.0
---

# UI Cloner

Placeholder skill. Replace this content with the actual ui-cloner workflow.

## Use When

- Creating a new agent skill from scratch
- Learning the Agent Skills format
- Understanding skill best practices
- Referencing proper YAML frontmatter structure

## Instructions

When creating a new skill, follow these guidelines:

### 1. Skill Naming

Choose a descriptive, kebab-case name that clearly indicates the skill's purpose:
- Use lowercase letters and numbers only
- Separate words with single hyphens
- Keep it concise (1-64 characters)
- Examples: `react-best-practices`, `api-design-patterns`, `git-workflow`

### 2. Required Components

Every skill MUST include:
- A `SKILL.md` file with valid YAML frontmatter
- A `name` field matching the directory name
- A `description` field (1-1024 characters)

### 3. Optional Components

Enhance your skill with:
- **scripts/**: Executable automation for deterministic tasks
- **references/**: Detailed documentation loaded on-demand
- **assets/**: Templates, examples, configuration files

### 4. Writing Effective Instructions

Make instructions:
- **Actionable**: Use clear imperatives (e.g., "Use X when Y", "Implement Z")
- **Specific**: Provide concrete examples and patterns
- **Concise**: Keep the main SKILL.md focused; move details to references/
- **Searchable**: Include keywords agents can grep for

### 5. Progressive Disclosure

For complex topics:
1. Provide a brief overview in SKILL.md
2. Include search patterns for finding detailed info
3. Move comprehensive documentation to references/
4. Keep agent context lightweight by default

## Example Usage

When an agent loads this skill, it will:
1. Read the YAML frontmatter for metadata
2. Parse the markdown instructions
3. Discover optional scripts and references
4. Apply the guidelines to its task

## Script Guidelines

If adding scripts to `scripts/`:
- Make them executable (`chmod +x script.sh`)
- Include error handling
- Add usage documentation
- Review them like production code
- Prefer scripts over natural language for consistency

## Reference Guidelines

If adding references to `references/`:
- Use clear, descriptive filenames
- Structure content with headers for greppability
- Avoid duplicating content from SKILL.md
- Link from SKILL.md with search patterns

## Testing Your Skill

Validate your skill by:
1. Checking YAML frontmatter syntax
2. Ensuring directory name matches the `name` field
3. Verifying description length (1-1024 chars)
4. Testing with multiple agents when possible
5. Confirming scripts are executable and functional

## Common Patterns

**Use When Section**: Always start with clear use cases
```markdown
## Use When

- Implementing feature X
- Debugging issue Y
- Following pattern Z
```

**Progressive References**:
```markdown
For detailed API documentation, search references/api-guide.md for "Authentication"
```

**Script Integration**:
```markdown
To automate this process, run:
`./scripts/setup.sh`
```

## Additional Resources

- [Agent Skills FAQ](https://vercel.com/blog/agent-skills-explained-an-faq)
- [Vercel Agent Skills Repo](https://github.com/vercel-labs/agent-skills)
- [Skills CLI](https://github.com/vercel-labs/skills)

## License

MIT
