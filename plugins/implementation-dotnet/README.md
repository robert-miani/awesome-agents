# Implementation — .NET

## Description

Implementation — .NET scaffolds and implements backend features on a feature branch
following clean architecture conventions: MediatR commands/queries, EF Core
repositories, FluentValidation, versioned REST APIs, and structured error handling.
Each skill covers one architectural concern and produces runnable, test-ready code.

## When to Use

- Scaffolding a new .NET solution or module from an architecture plan
- Implementing a feature end-to-end (command → handler → persistence → API endpoint)
- Applying consistent patterns for validation, error handling, or configuration
- Adding or updating infrastructure integrations (HTTP clients, EF Core migrations)

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [dotnet-architecture](skills/dotnet-architecture/SKILL.md) | `/implementation-dotnet:dotnet-architecture` | Define solution architecture and layer structure |
| [dotnet-architecture-infrastructure-db](skills/dotnet-architecture-infrastructure-db/SKILL.md) | `/implementation-dotnet:dotnet-architecture-infrastructure-db` | Design the infrastructure/database layer |
| [dotnet-architecture-presentation-rest](skills/dotnet-architecture-presentation-rest/SKILL.md) | `/implementation-dotnet:dotnet-architecture-presentation-rest` | Design the presentation/REST API layer |
| [common-hexagonal-architecture](skills/common-hexagonal-architecture/SKILL.md) | `/implementation-dotnet:common-hexagonal-architecture` | Apply hexagonal (ports & adapters) architecture |
| [dotnet-scaffold](skills/dotnet-scaffold/SKILL.md) | `/implementation-dotnet:dotnet-scaffold` | Scaffold a new .NET solution or project |
| [dotnet-feature](skills/dotnet-feature/SKILL.md) | `/implementation-dotnet:dotnet-feature` | Implement a complete feature (command + handler + endpoint) |
| [dotnet-module-registration](skills/dotnet-module-registration/SKILL.md) | `/implementation-dotnet:dotnet-module-registration` | Register modules and services in DI container |
| [dotnet-mediatr](skills/dotnet-mediatr/SKILL.md) | `/implementation-dotnet:dotnet-mediatr` | Add MediatR commands, queries, and handlers |
| [dotnet-ef-core](skills/dotnet-ef-core/SKILL.md) | `/implementation-dotnet:dotnet-ef-core` | Add EF Core entities, configurations, and migrations |
| [dotnet-fluent-validation](skills/dotnet-fluent-validation/SKILL.md) | `/implementation-dotnet:dotnet-fluent-validation` | Add FluentValidation validators for commands/queries |
| [dotnet-error-handling](skills/dotnet-error-handling/SKILL.md) | `/implementation-dotnet:dotnet-error-handling` | Add structured error handling and problem details |
| [dotnet-configuration](skills/dotnet-configuration/SKILL.md) | `/implementation-dotnet:dotnet-configuration` | Add strongly-typed configuration with options pattern |
| [dotnet-api-versioning](skills/dotnet-api-versioning/SKILL.md) | `/implementation-dotnet:dotnet-api-versioning` | Add API versioning to controllers and endpoints |
| [dotnet-infrastructure-http](skills/dotnet-infrastructure-http/SKILL.md) | `/implementation-dotnet:dotnet-infrastructure-http` | Add typed HTTP clients for external service integration |
| [dotnet-code-style](skills/dotnet-code-style/SKILL.md) | `/implementation-dotnet:dotnet-code-style` | Enforce .NET code style and naming conventions |
| [common-clean-code](skills/common-clean-code/SKILL.md) | `/implementation-dotnet:common-clean-code` | Apply clean code principles across the codebase |
| [git-commit](skills/git-commit/SKILL.md) | `/implementation-dotnet:git-commit` | Commit implementation with a conventional message |

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/implementation-dotnet
```

Start Claude Code from the target repository root.

### Invoke

```text
/implementation-dotnet:dotnet-feature implement CreateOrder command
```

```text
/implementation-dotnet:dotnet-ef-core add Order entity with migration
```

## Example

Implementing a `CreateOrder` feature from an architecture plan:

1. `/implementation-dotnet:dotnet-mediatr` — `CreateOrderCommand` + `CreateOrderHandler`
2. `/implementation-dotnet:dotnet-ef-core` — `Order` entity, `OrderConfiguration`, migration
3. `/implementation-dotnet:dotnet-fluent-validation` — `CreateOrderCommandValidator`
4. `/implementation-dotnet:dotnet-architecture-presentation-rest` — `OrdersController` endpoint
5. `/implementation-dotnet:git-commit` — commits the feature branch

## Requirements

- Claude Code for plugin loading
- .NET 8+ SDK installed in the target repository environment
- Existing solution structure (or use `dotnet-scaffold` first)
