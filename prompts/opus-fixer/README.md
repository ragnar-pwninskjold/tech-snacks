# opus-fixer

A system-prompt append that enforces clear, concise, actionable communication patterns for Claude Code.

## Usage

Run the following command when you boot up Claude Code:

```bash
claude --append-system-prompt-file ./opus-fixer.md
```

`opus-fixer.md` must live in the same repo level as where the command is being called.

## Credit

Implementation by [indydevdan](https://github.com/disler).
