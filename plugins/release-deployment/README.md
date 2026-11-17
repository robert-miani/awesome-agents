# Release & Deployment

## Description

Release & Deployment covers CI/CD operations, Azure resource management, rollout
planning, and infrastructure diagnostics. It provides CLI-driven access to Azure
DevOps pipelines, boards, and repos; generates visual Azure resource topology diagrams;
diagnoses resource health issues; and produces structured rollout plans.

## When to Use

- Triggering or monitoring Azure DevOps pipelines from the terminal
- Generating a rollout plan and checklist before a production release
- Diagnosing unhealthy Azure resources or services
- Visualising the Azure infrastructure topology of an environment
- Managing work items, boards, or sprints in Azure DevOps

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [azure-devops-cli](skills/azure-devops-cli/SKILL.md) | `/release-deployment:azure-devops-cli` | Operate Azure DevOps via `az devops` CLI (pipelines, boards, repos) |
| [devops-rollout-plan](skills/devops-rollout-plan/SKILL.md) | `/release-deployment:devops-rollout-plan` | Generate a structured rollout plan and go/no-go checklist |
| [azure-resource-health-diagnose](skills/azure-resource-health-diagnose/SKILL.md) | `/release-deployment:azure-resource-health-diagnose` | Diagnose Azure resource health issues and surface remediation steps |
| [azure-resource-visualizer](skills/azure-resource-visualizer/SKILL.md) | `/release-deployment:azure-resource-visualizer` | Generate an Azure infrastructure topology diagram |
| [git-commit](skills/git-commit/SKILL.md) | `/release-deployment:git-commit` | Commit deployment artifacts with a conventional message |

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/release-deployment
```

Start Claude Code from the target repository root.

### Invoke

```text
/release-deployment:devops-rollout-plan release/2.4.0
```

```text
/release-deployment:azure-resource-health-diagnose production
```

## Example

Pre-release checklist for `release/2.4.0`:

1. `/release-deployment:azure-resource-health-diagnose` — confirms all production resources healthy
2. `/release-deployment:devops-rollout-plan` — produces `docs/releases/2.4.0-rollout.md` with
   deployment steps, rollback plan, and go/no-go criteria
3. `/release-deployment:azure-devops-cli` — triggers the release pipeline
4. `/release-deployment:azure-resource-visualizer` — generates a post-deploy topology snapshot
5. `/release-deployment:git-commit` — commits the rollout plan document

## Requirements

- Claude Code for plugin loading
- Azure CLI (`az`) installed and authenticated (`az login`)
- Azure DevOps extension: `az extension add --name azure-devops`
- `az devops configure --defaults organization=<org> project=<project>`
