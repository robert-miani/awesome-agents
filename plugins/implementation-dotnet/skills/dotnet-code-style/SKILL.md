---
name: dotnet-code-style
description: >
  .NET code style and formatting conventions for C# projects, aligned with Microsoft's official C#
  coding conventions and enforced by .editorconfig at build time. Use this skill whenever generating
  or reviewing C# code to ensure consistent style. Trigger on any C# code generation, refactoring,
  or code review task. Apply these conventions automatically when writing new code.
---

# Code Style Skill (.NET / C#)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

## Source of Truth

1. **The solution's own `.editorconfig` wins.** In an existing repository, read it first and follow it, even where it differs from this skill. Don't reformat code you aren't changing.
2. **New solutions** get `dotnet-scaffold/templates/.editorconfig`, which encodes the rules below, and `<EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>` in `Directory.Build.props`, so `dotnet build` reports violations.
3. **Anything not covered here** follows Microsoft's [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) and [identifier naming rules](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/identifier-names).

After generating code, run `dotnet build` and fix every `IDE*` warning before you're done.

---

## Rules

| Rule | Do | Don't | Enforced by |
|------|----|-------|-------------|
| File-scoped namespaces | `namespace Foo;` | `namespace Foo { ... }` | IDE0161 |
| `using` directives **outside** the namespace, `System.*` first | see example | usings after `namespace Foo;` | IDE0065 |
| Explicit usings | every file declares its usings (`<ImplicitUsings>disable</ImplicitUsings>`) | relying on global usings | — |
| `var` only when the type is apparent | `var order = new Order(...);` | `var orders = await repo.ListAsync(ct);` | IDE0008 |
| Explicit type for built-in types | `int count = 0;` `string name = "x";` | `var count = 0;` | IDE0008 |
| Explicit type in `foreach` | `foreach (Order order in orders)` | `foreach (var order in orders)` | IDE0008 |
| Braces on every control statement | `if (x) { Do(); }` (Allman style) | `if (x) Do();` | IDE0011 |
| No `this.` qualification | `_unitOfWork.Save()` | `this._unitOfWork.Save()` | IDE0003 |
| Language keywords | `string`, `int` | `String`, `Int32` | IDE0049 |
| `_camelCase` private/internal fields | `private readonly IService _service;` | `service`, `m_service` | naming rule |
| `readonly` fields where possible | `private readonly int _count;` | | IDE0044 |
| `DateTimeOffset` for timestamps | `DateTimeOffset.UtcNow` | `DateTime.UtcNow` | review |
| Pattern matching, `?.`, `??`, initializers | `if (obj is string s)` | casts + null checks | suggestions |

### `var`: when is the type "apparent"?

The type is apparent when the right-hand side names it: `new Foo(...)`, a cast `(Foo)x`, `x as Foo`, `default(Foo)`.
Everything else (method calls, `await`, LINQ, `configuration.Get<T>()`) uses the explicit type:

```csharp
var order = new Order(customerId);                          // OK: type is on the right
Order order = new Order(customerId);                        // also OK
Order? order = await _repository.GetByIdAsync(id, ct);      // explicit: not apparent
List<OrderSummary> summaries = await query.ToListAsync(ct); // explicit: not apparent
```

### Primary constructors (C# 12 / .NET 8+)

Primary constructors are allowed. For classes that only receive dependencies (handlers, services, controllers), either style is fine; stay consistent within a project:

```csharp
internal sealed class OrderService(IUnitOfWork unitOfWork, ILogger<OrderService> logger) : IOrderService
{
    public async Task<Guid> CreateAsync(CreateOrderRequest request, CancellationToken ct)
    {
        Order order = Order.Create(request.CustomerId, request.Lines);
        unitOfWork.Orders.Add(order);
        await unitOfWork.SaveChangesAsync(ct);
        logger.LogInformation("Order {OrderId} created", order.Id);
        return order.Id;
    }
}
```

- Primary-constructor parameters use `camelCase` because they are parameters, not fields. Record positional parameters use `PascalCase`.
- Parameters are **mutable captures, not `readonly` fields**. Never assign to them. If the class needs argument validation or a `readonly` guarantee, use a traditional constructor with `_` fields.
- Don't capture a parameter *and* copy it into a field; pick one.
- On C# versions before 12 (e.g. .NET 6/7, .NET Framework), use traditional constructors.

### Expression-bodied members

Expression bodies are allowed for **single-line** members (properties, accessors, lambdas, short methods). Anything longer than one line uses a block body.

```csharp
public decimal Total => _items.Sum(i => i.Price * i.Quantity);           // OK
public override string ToString() => $"Order {Id}";                      // OK
```

---

## Code Example

```csharp
// <copyright file="CreateOrderCommandHandler.cs" company="YourCompany">
// Copyright (C) YourCompany. All rights reserved.
// </copyright>

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Orders;

namespace ProjectName.Application.Orders;

public sealed record CreateOrderCommand(Guid CustomerId, decimal Amount) : IRequest<Guid>;

internal sealed class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order(request.CustomerId, request.Amount);
        _unitOfWork.Orders.Add(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return order.Id;
    }
}
```

---

## Naming Conventions

| Symbol | Convention | Example |
|--------|------------|---------|
| Interface | `I` prefix + PascalCase | `IOrderRepository` |
| Class/Struct/Enum/Record | PascalCase | `OrderStatus` |
| Method, Property, Event | PascalCase | `GetOrderById`, `CustomerId` |
| Async method | `Async` suffix | `GetOrderByIdAsync` |
| Private/internal field | `_` prefix + camelCase | `_unitOfWork` |
| Private static field | PascalCase | `DefaultTimeout` |
| Constant | PascalCase | `MaxRetryCount` |
| Parameter, local, primary-ctor parameter | camelCase | `orderId` |
| Record positional parameter | PascalCase | `record Money(decimal Amount)` |
| Type parameter | `T` prefix | `TResponse` |

---

## Checklist

When generating or reviewing C# code:

- [ ] Existing `.editorconfig` read and followed (existing projects)
- [ ] File-scoped namespace; usings **above** it, `System.*` first
- [ ] `var` only where the type is apparent; explicit types for built-ins, `await`/method results and `foreach`
- [ ] Braces on all control statements
- [ ] No `this.`; private fields prefixed with `_`
- [ ] Primary constructors only on C# 12+, parameters never reassigned
- [ ] Expression bodies only for single-line members
- [ ] `readonly` fields and pattern matching where applicable
- [ ] `DateTimeOffset` used instead of `DateTime` for timestamps
- [ ] `dotnet build` produces no `IDE*` warnings

---

## Gotchas

- **Usings outside vs inside the namespace:** older StyleCop setups (SA1200) require them *inside*. Microsoft recommends *outside*, because a `using` inside a namespace resolves relative to that namespace and can silently bind to a different type when a new namespace is added. If an existing project uses inside placement, keep it there.
- **Code-style severities only fail the build with `EnforceCodeStyleInBuild=true`** (and `TreatWarningsAsErrors`). Without it, `IDE*` rules show only in the IDE and the build stays silent.
- **IDE0005 (unnecessary usings) needs `<GenerateDocumentationFile>true</GenerateDocumentationFile>`** to run on build.
- **`DateTimeOffset` with PostgreSQL:** Npgsql maps it to `timestamptz` and only accepts offset `+00:00`, so always use `UtcNow` or `TimeProvider.GetUtcNow()`.
