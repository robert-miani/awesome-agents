# .NET Feature Implementation

## Description

Add new features to existing .NET 9/10 clean architecture solutions. Guides implementation across all layers — Domain, Application.Contracts, Application, Infrastructure, and Presentation — following established patterns and the correct implementation order.

## When to Use

- Adding a new endpoint, command, or query
- Creating a new entity with full CRUD across layers
- Implementing a new feature that touches multiple layers
- Scaffolding handler + validator + controller for a new operation
- Any request to extend an existing .NET solution with new functionality

## Usage

Activate this skill when adding features. Follow the implementation order:

1. **Domain** — entity / value object / enum
2. **Application.Contracts** — repository interface, DTOs
3. **Application** — static class with Command/Query, Validator, Handler
4. **Infrastructure.Db** — repository implementation, EF config, migration
5. **Infrastructure.Http** — (if needed) external service client
6. **Presentation.Api** — controller action

**Prerequisites:** Load `dotnet-architecture`, `dotnet-code-style`, `dotnet-fluent-validation`, and `dotnet-ef-core` first — plus `dotnet-mediatr` only if the solution uses MediatR. The skill detects the solution's conventions (target framework, MediatR vs application services, validation, data access, tests) before writing code.

## Example

For a `CreateOrder` feature:

```
Domain/Orders/Order.cs                          → Entity
Application.Contracts/Persistence/IOrderRepo    → Interface
Application/Orders/CreateOrder.cs               → Command + Validator + Handler
Infrastructure.Db/Repositories/OrderRepo        → Implementation
Presentation.Api/Controllers/Orders/v1/         → Controller action
```

```csharp
// Application/Orders/CreateOrder.cs
public static class CreateOrder
{
    public sealed record Command(string Name) : IRequest<Guid>;

    internal sealed class Validator : AbstractValidator<Command> { ... }
    internal sealed class Handler : IRequestHandler<Command, Guid> { ... }
}
```

## Requirements

- .NET 9 or 10
- Existing clean architecture solution
- `dotnet-architecture` skill (prerequisite)
- `dotnet-code-style` skill (prerequisite)
- `dotnet-mediatr` skill (only for solutions that use MediatR)
- `dotnet-fluent-validation` skill (prerequisite)
