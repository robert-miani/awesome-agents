# Implementation — .NET

## Description

Implementation — .NET scaffolds, implements and tests backend features on a feature branch
following clean architecture conventions: MediatR commands/queries **or** plain application
services (whichever the solution already uses), EF Core repositories, FluentValidation,
versioned REST APIs, and structured error handling — with unit tests and integration tests
against a real database. New solutions target .NET 9/10; existing solutions on older
frameworks keep their own target framework and package versions.
Each skill covers one architectural concern and produces runnable, tested code.

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
| [dotnet-mediatr](skills/dotnet-mediatr/SKILL.md) | `/implementation-dotnet:dotnet-mediatr` | Add MediatR commands, queries, and handlers (only in solutions that use MediatR) |
| [dotnet-ef-core](skills/dotnet-ef-core/SKILL.md) | `/implementation-dotnet:dotnet-ef-core` | Add EF Core entities, configurations, and migrations |
| [dotnet-fluent-validation](skills/dotnet-fluent-validation/SKILL.md) | `/implementation-dotnet:dotnet-fluent-validation` | Add FluentValidation validators for commands/queries |
| [dotnet-error-handling](skills/dotnet-error-handling/SKILL.md) | `/implementation-dotnet:dotnet-error-handling` | Add structured error handling and problem details |
| [dotnet-configuration](skills/dotnet-configuration/SKILL.md) | `/implementation-dotnet:dotnet-configuration` | Add strongly-typed configuration with options pattern |
| [dotnet-api-versioning](skills/dotnet-api-versioning/SKILL.md) | `/implementation-dotnet:dotnet-api-versioning` | Add API versioning to controllers and endpoints |
| [dotnet-infrastructure-http](skills/dotnet-infrastructure-http/SKILL.md) | `/implementation-dotnet:dotnet-infrastructure-http` | Add typed HTTP clients for external service integration |
| [dotnet-unit-testing](skills/dotnet-unit-testing/SKILL.md) | `/implementation-dotnet:dotnet-unit-testing` | Unit-test entities, handlers/services and validators (xUnit v3 + NSubstitute + Shouldly by default) |
| [dotnet-integration-testing](skills/dotnet-integration-testing/SKILL.md) | `/implementation-dotnet:dotnet-integration-testing` | Integration-test endpoints with WebApplicationFactory, Testcontainers and Respawn |
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

1. `/implementation-dotnet:dotnet-feature` — detects the solution's conventions (target framework, MediatR or services, validation, data access)
2. `/implementation-dotnet:dotnet-mediatr` — `CreateOrder` command + handler (or an `IOrderService` method in a solution without MediatR)
3. `/implementation-dotnet:dotnet-ef-core` — `Order` entity, `OrderConfiguration`, migration
4. `/implementation-dotnet:dotnet-fluent-validation` — `CreateOrder.Validator`
5. `/implementation-dotnet:dotnet-architecture-presentation-rest` — `OrdersController` endpoint
6. `/implementation-dotnet:dotnet-unit-testing` — handler/service, validator and entity tests
7. `/implementation-dotnet:dotnet-integration-testing` — `POST`/`GET` endpoint tests against a PostgreSQL container
8. `/implementation-dotnet:git-commit` — commits the feature branch

## Requirements

- Claude Code for plugin loading
- .NET 9 or 10 SDK for new solutions; existing solutions use the SDK pinned in their own `global.json`
- Existing solution structure (or use `dotnet-scaffold` first)
- Docker for integration tests (Testcontainers)
