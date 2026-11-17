# .NET Architecture

## Description

Clean architecture guidance for .NET 9/10 layered solutions. Defines solution structure, layer responsibilities, project references, and where code belongs across Startup, Presentation, Application, Domain, and Infrastructure layers.

## When to Use

- Deciding where code belongs in a layered .NET solution
- Setting up project references between layers
- Understanding layer responsibilities (Startup, Presentation, Application, Domain, Infrastructure)
- Answering "which layer does X go in?" questions
- Reviewing architecture for dependency rule violations

## Usage

Activate this skill when working with .NET solution structure. It provides:

- Complete solution folder layout
- Project reference rules (what references what)
- Layer responsibility definitions
- Placement rules for common components (DTOs, interfaces, entities, handlers)

## Example

```
src/
  ProjectName.Startup                       → Entry point, wires DI only
  Presentation/
    ProjectName.Presentation.Api            → Controllers, routing
  Application/
    ProjectName.Application                 → MediatR handlers, validators
    ProjectName.Application.Contracts       → Interfaces + shared DTOs
  Domain/
    ProjectName.Domain                      → Entities, value objects, enums
  Infrastructure/
    ProjectName.Infrastructure.Db           → EF Core, repositories, UoW
```

**Reference direction:**

```
Startup → Presentation → Application → Infrastructure → Domain
                              ↓
                     Application.Contracts ← Infrastructure
```

## Requirements

- .NET 9 or 10
- Familiarity with clean architecture concepts
