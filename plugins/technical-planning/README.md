# Technical Planning

## Description

Technical Planning translates a specification into architecture documents, component
diagrams, and a task breakdown ready for implementation. It supports .NET clean
architecture patterns (hexagonal, layered, infrastructure/presentation separation)
and generates PlantUML, Mermaid, and ASCII diagrams for each architectural view.

## When to Use

- Designing the solution architecture from an approved specification
- Producing architecture decision records and component diagrams
- Breaking a spec into implementation tasks with clear layer ownership
- Visualising hexagonal, layered, or infrastructure/presentation boundaries

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [common-ascii-diagram](skills/common-ascii-diagram/SKILL.md) | `/technical-planning:common-ascii-diagram` | Generate plain-text ASCII diagrams |
| [common-mermaid-diagram](skills/common-mermaid-diagram/SKILL.md) | `/technical-planning:common-mermaid-diagram` | Generate Mermaid diagrams |
| [common-plantuml-diagram](skills/common-plantuml-diagram/SKILL.md) | `/technical-planning:common-plantuml-diagram` | Generate PlantUML diagrams as `.puml` + `.svg` |
| [dotnet-architecture](skills/dotnet-architecture/SKILL.md) | `/technical-planning:dotnet-architecture` | Define .NET solution architecture and layer structure |
| [dotnet-architecture-infrastructure-db](skills/dotnet-architecture-infrastructure-db/SKILL.md) | `/technical-planning:dotnet-architecture-infrastructure-db` | Design the infrastructure/database layer |
| [dotnet-architecture-presentation-rest](skills/dotnet-architecture-presentation-rest/SKILL.md) | `/technical-planning:dotnet-architecture-presentation-rest` | Design the presentation/REST API layer |
| [common-hexagonal-architecture](skills/common-hexagonal-architecture/SKILL.md) | `/technical-planning:common-hexagonal-architecture` | Apply hexagonal (ports & adapters) architecture |
| [git-commit](skills/git-commit/SKILL.md) | `/technical-planning:git-commit` | Commit planning documents with a conventional message |

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/technical-planning
```

Start Claude Code from the target repository root.

### Invoke

```text
/technical-planning:dotnet-architecture
```

```text
/technical-planning:common-plantuml-diagram component diagram for the payment service
```

## Example

Input: an approved spec at `docs/specs/payment-service.md`.

1. `/technical-planning:dotnet-architecture` produces `docs/architecture/solution-structure.md`
2. `/technical-planning:common-hexagonal-architecture` documents port/adapter boundaries
3. `/technical-planning:common-plantuml-diagram` generates component and sequence diagrams
4. `/technical-planning:git-commit` commits all planning documents

## Requirements

- Claude Code for plugin loading
- Read access to the input specification
- Write access to the architecture output directory
