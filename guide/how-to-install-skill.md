# 🛠️ How to Install a Skill or Plugin

This guide covers installing skills and plugins in the three major AI coding agents: **GitHub Copilot CLI**, **Claude Code**, and **Codex CLI**.

---

## GitHub Copilot CLI

### Install a skill

```bash
# Register the marketplace (one-time setup)
copilot skill marketplace add <github-owner>/awesome-agents

# Install a skill
copilot skill install <skill-name>@awesome-agents
```

### Install a plugin

```bash
# Register the marketplace (one-time setup)
copilot plugin marketplace add <github-owner>/awesome-agents

# Install a plugin
copilot plugin install <plugin-name>@awesome-agents
```

### Use a skill in a session

```bash
copilot chat --skill <skill-name>
```

---

## Claude Code

Claude Code supports standalone skills and plugins.

- Standalone skills live under `.claude/skills/<skill-name>/` or
  `~/.claude/skills/<skill-name>/`.
- Plugins are directories that contain `.claude-plugin/plugin.json`. Skills
  bundled inside plugins live under `skills/<skill-name>/SKILL.md` and are
  invoked with a namespace such as `/plugin-name:skill-name`.

### Install a skill manually

1. Copy the skill folder into your project:
   ```bash
   cp -r <skill-folder> .claude/skills/<skill-name>/
   ```

2. Start Claude Code from the project root and invoke the skill:
   ```text
   /<skill-name>
   ```

Claude Code discovers skills from `.claude/skills/`; a separate
`settings.json` skills list is not required.

### Use a local plugin

Use `--plugin-dir` while developing or trying a plugin directly from this
repository. Start Claude Code from the target repository root:

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/common/repo-knowledge-pack
```

Then invoke the bundled skill with the plugin namespace:

```text
/repo-knowledge-pack:generate-knowledge-pack
```

### Install via the registry script _(coming soon)_

```bash
# Planned helper script
npx awesome-agents-install skill <skill-name>
```

### Use a skill in a session

Activate a skill by referencing it at the start of your prompt:
```
/skill <skill-name>
<your request here>
```

---

## Codex CLI

### Install a skill

Codex CLI reads instructions from `.codex/` in your project directory.

1. Download the skill:
   ```bash
   curl -L https://raw.githubusercontent.com/<github-owner>/awesome-agents/main/skills/<discipline>/<skill-name>/skill.md \
     -o .codex/skills/<skill-name>.md
   ```

2. Reference it in your `.codex/config.json`:
   ```json
   {
     "instructions": [".codex/skills/<skill-name>.md"]
   }
   ```

### Use a skill in a session

Pass the skill file as an instruction at runtime:
```bash
codex --instructions .codex/skills/<skill-name>.md "<your request>"
```

---

## Installing Multiple Skills

For complex workflows, install several skills and load them together:

```bash
# Copilot CLI — load multiple skills
copilot chat --skill development-review --skill qa-test-gen

# Codex CLI — combine instruction files
codex --instructions .codex/skills/dev-review.md --instructions .codex/skills/qa-tests.md "<request>"
```

Or use a **plugin** that bundles the right skills for your workflow — see the [Plugins Registry](../plugins/README.md).

---

## Verify an Installation

Before using a new skill in production, review its `README.md` and `skill.md` to understand what it does, what tools it needs, and any security implications.

> ⚠️ Skills can run arbitrary agent actions. Only install from trusted sources.
