# 🚀 How to Promote a Skill to the Shared Library

If you have a project skill that consistently delivers value and could benefit other teams, promote it to this shared repository.

---

## Promotion Criteria

Before submitting, verify the skill meets these criteria:

| Criterion | Check |
|-----------|-------|
| Solves a real, recurring problem | ✅ |
| Works across more than one project (not project-specific) | ✅ |
| Has a clear, focused responsibility | ✅ |
| Includes a `README.md` with description, usage, and an example | ✅ |
| `SKILL.md` has valid frontmatter (`name` matches folder, `description` covers what + when) | ✅ |
| `SKILL.md` body is under 500 lines / 5 000 tokens | ✅ |
| No hardcoded project-specific paths, names, or secrets | ✅ |
| Assigned to the correct discipline folder | ✅ |

---

## Step-by-Step

### 1. Fork and clone this repository

```bash
git clone https://github.com/robert-miani/awesome-agents.git
cd awesome-agents
```

### 2. Choose the right discipline folder

Place the skill under the appropriate discipline:

```
skills/
  development/       ← code, architecture, APIs
  quality-assurance/ ← testing, bug triage
  business-analysis/ ← requirements, user stories
  project-management/← planning, sprints, retros
  team-development/  ← feedback, 1-on-1s, careers
  design-and-ux/     ← UX/UI, accessibility
  devops/            ← CI/CD, infra, monitoring
  common/            ← cross-cutting, reusable everywhere
```

If unsure, use `common/` and note in your PR.

### 3. Create the skill folder

```
skills/<discipline>/<skill-name>/
├── SKILL.md      ← frontmatter + instructions (agentskills.io format)
├── README.md     ← human documentation
├── scripts/      ← optional: executable scripts
├── references/   ← optional: detailed docs loaded on demand
└── assets/       ← optional: templates, schemas
```

#### `SKILL.md` frontmatter must include:

```yaml
---
name: skill-name        # must match folder name exactly
description: >          # what it does + when to trigger it
  ...
license: Proprietary
metadata:
  author: awesome-agents
  version: "1.0"
---
```

#### `README.md` must include:

```markdown
# <Skill Name>

## Description
One paragraph describing what this skill does.

## When to Use
- Bullet list of scenarios where this skill is useful

## Usage
How to activate and use this skill (tool-specific examples).

## Example
A short before/after or input/output example.

## Requirements
Any tools, MCPs, or context the skill depends on.
```

### 4. Register in the registry

Add a row for your skill in:
- [`guide/skills-registry.md`](skills-registry.md) — master public registry
- [`skills/README.md`](../skills/README.md) — discipline-specific table

### 5. Open a Pull Request

```bash
git checkout -b skill/<skill-name>
git add skills/<discipline>/<skill-name>/ guide/skills-registry.md skills/README.md
git commit -m "feat(skills): add <skill-name> to <discipline>"
git push origin skill/<skill-name>
```

Open a PR against `main`. Include:
- A short description of what problem it solves
- Which project(s) you've tested it on
- Any known limitations

---

## Review Process

1. A library maintainer will review the skill for quality, scope, and naming
2. Feedback may be given via PR comments
3. Once approved, the skill is merged and listed in the public registry

---

## Promoting a Plugin

Follow the same process, but place the plugin under `plugins/<discipline>/` and update `plugins/README.md` instead.

---

## Questions?

Open a GitHub Discussion or ping the `#ai-agents` channel in Slack.
