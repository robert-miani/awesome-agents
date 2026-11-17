# 🧱 How to Create Project Skills

Project skills live **inside your own repository** and are specific to your project's conventions, stack, or workflow. They follow the [agentskills.io](https://agentskills.io) open standard — the same format works across GitHub Copilot, Claude Code, and Codex CLI.

---

## When to Create a Project Skill

Create a skill when you want an agent to:
- Follow project-specific coding conventions or architecture patterns
- Know your non-obvious domain facts (table naming, soft-delete patterns, internal API quirks)
- Perform a repeatable multi-step workflow consistently

---

## Skill Folder Structure

```
<skill-name>/
├── SKILL.md        ← required: YAML frontmatter + instructions
├── README.md       ← required: human description, when-to-use, usage example
├── scripts/        ← optional: executable scripts the agent can run
├── references/     ← optional: detailed docs the agent loads on demand
└── assets/         ← optional: templates, schemas, static resources
```

Default skill locations by tool:

| Tool | Location |
|------|----------|
| GitHub Copilot (VS Code) | `.agents/skills/<skill-name>/` |
| Claude Code | `.claude/skills/<skill-name>/` |
| Codex CLI | `.codex/skills/<skill-name>/` |

---

## Step-by-Step

### 1. Choose a name

`kebab-case`, max 64 characters. Be specific:
- ✅ `api-endpoint-generator`
- ✅ `database-migration-reviewer`
- ❌ `helper` · ❌ `coding`

### 2. Create `SKILL.md`

Start with YAML frontmatter, then write the instructions as Markdown:

```markdown
---
name: api-endpoint-generator
description: >
  Generate REST API endpoint handlers following project conventions.
  Use when asked to create, scaffold, or add an API endpoint or route.
license: Proprietary
metadata:
  author: awesome-agents
  version: "1.0"
---

## Context

- Framework: Express.js with TypeScript
- Validation: Zod schemas in `src/schemas/`
- Error handling: `AppError` class from `src/lib/errors.ts`
- Tests: Jest + Supertest, co-located as `<name>.test.ts`

## Steps

1. Define the Zod request/response schema in `src/schemas/`
2. Implement the handler in `src/handlers/`
3. Register the route in `src/routes/index.ts`
4. Generate a co-located test file

## Gotchas

- All routes require the `authenticate` middleware unless marked `public`
- Route paths must use snake_case, not camelCase
```

**Frontmatter field rules:**

| Field | Required | Rules |
|-------|----------|-------|
| `name` | ✅ | Max 64 chars · lowercase + hyphens only · must match folder name |
| `description` | ✅ | Max 1024 chars · say WHAT it does AND WHEN to trigger it |
| `license` | no | e.g. `Proprietary` or `Apache-2.0` |
| `compatibility` | no | Only if specific tools/env are needed |
| `metadata` | no | Free key-value map |
| `allowed-tools` | no | Space-separated list (experimental) |

**Body guidelines:**
- Keep under **500 lines / 5 000 tokens** — move deep reference material to `references/`
- Include only what the agent *wouldn't* know without the skill
- A `## Gotchas` section is high-value: list non-obvious project-specific facts the agent will get wrong otherwise
- When instructions are long, reference files conditionally: `"If the API returns non-200, read references/api-errors.md"`

### 3. Create `README.md`

```markdown
# <Skill Name>

## Description
One paragraph on what the skill does.

## When to Use
- Bullet list of trigger scenarios

## Usage
Tool-specific activation examples.

## Example
Short before/after or input/output example.

## Requirements
Any tools, MCPs, or context needed.
```

### 4. Test and iterate

Activate the skill and run a real task. Read the agent's execution trace — not just the final output. Common issues:
- **Too vague**: agent tries multiple approaches before succeeding → add specificity
- **Wrong trigger**: skill activates for unrelated tasks → tighten the `description`
- **Skipped steps**: checklist format improves step completion

### 5. Register the skill

Once the skill is working, add it to both catalog files so others can discover it:

**`skills/README.md`** — add a row under the matching discipline table:

```markdown
| [your-skill-name](development/your-skill-name/README.md) | One-line description of what it does | When / for whom to use it |
```

**`guide/skills-registry.md`** — add a row to the full registry with path, supported tools, and status:

```markdown
| [your-skill-name](../skills/development/your-skill-name/README.md) | `skills/development/your-skill-name/` | One-line description | Claude Code, Copilot, Codex | ✅ stable |
```

Use `🧪 beta` for status if the skill is new and still being validated in real projects.

---

## Ready to Share?

If your skill proves useful across projects, consider promoting it to this shared library.
See [how-to-promote-skill-to-library.md](how-to-promote-skill-to-library.md).
