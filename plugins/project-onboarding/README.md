# Project Onboarding

## Description

Project Onboarding generates a focused set of onboarding documents from
repository code, configuration, existing docs, and explicitly configured
external knowledge sources. It is intended for engineers, maintainers,
reviewers, and AI agents that need to understand how a repository works
without turning that understanding into one oversized Markdown file.

The default output is:

- `REPOSITORY_KNOWLEDGE.md`
- `docs/onboarding/ARCHITECTURE.md`
- `docs/onboarding/LOCAL_DEVELOPMENT.md`
- `docs/onboarding/ENGINEERING_GUIDE.md`
- `docs/onboarding/OPERATIONS.md`
- `docs/onboarding/EXTERNAL_CONTEXT.md`

## When to Use

- Onboarding a new engineer or reviewer to an existing project
- Generating repository understanding docs for an existing project
- Refreshing architecture, local development, engineering, or operations docs
- Preparing a maintainer handoff or AI-agent context pack
- Combining repository facts with Jira, Confluence, or another knowledge base
- Replacing a bloated single-file repository overview with focused docs

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/project-onboarding
```

Start Claude Code from the **target repository root** and load this plugin by
path. Claude Code auto-discovers skills from the `skills/` directory.

### Invoke

```text
/project-onboarding:repository-knowledge
```

You can pass optional focus guidance after the command:

```text
/project-onboarding:repository-knowledge focus on API boundaries and deployment
```

### Optional strict settings

To reduce repeated permission prompts while keeping writes inside the target
repository docs, start Claude with the optional strict settings file:

```powershell
$PluginRoot = "<path-to-awesome-agents>/plugins/project-onboarding"
claude --plugin-dir "$PluginRoot" --settings "$PluginRoot/assets/strict-repo-boundary.settings.json"
```

The strict settings auto-allow edits only to `REPOSITORY_KNOWLEDGE.md` and
`docs/onboarding/**`, allow read/search and safe git inspection commands,
deny common destructive shell commands, and disable bypass-permissions mode.
Use `--dangerously-skip-permissions` only in an isolated throwaway workspace.

## Example

Input:

```text
/project-onboarding:repository-knowledge
```

Expected result:

- `REPOSITORY_KNOWLEDGE.md` — short map of the repository with links to focused docs
- `docs/onboarding/ARCHITECTURE.md` — major components, boundaries, data flow, entry points
- `docs/onboarding/LOCAL_DEVELOPMENT.md` — setup, commands, dependencies, local workflows
- `docs/onboarding/ENGINEERING_GUIDE.md` — conventions, tests, module patterns, extension points
- `docs/onboarding/OPERATIONS.md` — CI/CD, deployment, observability, runbook signals
- `docs/onboarding/EXTERNAL_CONTEXT.md` — citations for any Jira, Confluence, or web sources used

The skill checks `git status` itself. If the target repository has existing
changes other than source-map input files, it stops and reports them. If the
tree is clean or only has `.claude/repo-knowledge.sources.*` or
`docs/onboarding/SOURCES.*`, it creates a branch named
`project-onboarding/update-YYYYMMDD-HHMMSS` and writes the documentation there.

## Knowledge Bases

The plugin does not contain Jira credentials, Azure credentials, API tokens, or
MCP server declarations. External knowledge is intentionally user-local:

- Configure Jira, Confluence, or other systems in Claude/MCP on the user's machine.
- Add a source map such as `.claude/repo-knowledge.sources.yaml` or pass a path
  to one in the prompt.
- Use `assets/repository-knowledge.example.yaml` as a starting point.
- Use `assets/examples/kerajel-nuclear-evaluation.sources.yaml` to demo
  repo-specific web sources for the NuclearEvaluation repository.
- Read `skills/repository-knowledge/references/knowledge-sources.md` for auth,
  Jira, Confluence, MCP, and local testing guidance.

For Atlassian Cloud, use the Atlassian/Rovo MCP server configured in Claude Code
with per-user authentication. For a self-hosted Jira instance (for example
`https://jira.example.com`), use the company-approved Jira connector for that instance.

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [repository-knowledge](skills/repository-knowledge/SKILL.md) | `/project-onboarding:repository-knowledge` | Generates or refreshes the full onboarding documentation set |

## Requirements

- Claude Code for plugin loading
- Repository read/write access for the generated documentation files
- Optional user-local MCP configuration for external knowledge bases

## Validation

```bash
git diff --check
claude plugin validate plugins/project-onboarding
```
