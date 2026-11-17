---
name: dotnet-code-style
description: >
  .NET code style and formatting conventions for C# projects. Use this skill whenever generating
  or reviewing C# code to ensure consistent style. Trigger on any C# code generation, refactoring,
  or code review task. Apply these conventions automatically when writing new code.
---

# Code Style Skill (.NET / C#)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

Apply these code style conventions to all C# code you generate or review. These rules ensure consistency across the codebase.

---

## Key Style Rules Summary

### DO

| Rule | Example |
|------|---------|
| Use explicit types (no `var`) | `string name = "value";` |
| Use file-scoped namespaces | `namespace Foo;` |
| Disable implicit usings | `<ImplicitUsings>disable</ImplicitUsings>` in Directory.Build.props |
| Write all usings explicitly | Every file declares its own `using` directives |
| Place usings inside namespace | See example below |
| Sort System usings first | `using System;` before others |
| Use `_` prefix for private fields | `private readonly IService _service;` |
| Use braces always | `if (x) { DoThing(); }` |
| Use language keywords | `string`, `int`, `bool` not `String`, `Int32`, `Boolean` |
| Use pattern matching | `if (obj is string s)` |
| Use collection/object initializers | `new List<int> { 1, 2, 3 }` |
| Use null propagation | `obj?.Method()` |
| Use coalesce expressions | `value ?? defaultValue` |
| Mark fields readonly | `private readonly int _count;` |
| Use `DateTimeOffset` over `DateTime` | `DateTimeOffset.UtcNow` not `DateTime.UtcNow` |

### DON'T

| Rule | Avoid |
|------|-------|
| Primary constructors | `class Foo(int x)` — use traditional constructors |
| Expression-bodied methods | Use block body `{ }` |
| `this.` prefix | Don't use `this.` — just use member name |
| `var` keyword | Use explicit types |
| Block-scoped namespaces | Use file-scoped `namespace Foo;` |

---

## Code Example

```csharp
// <copyright file="CreateOrderCommandHandler.cs" company="YourCompany">
// Copyright (C) YourCompany. All rights reserved.
// </copyright>

namespace ProjectName.Application.Orders;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Orders;

public sealed class CreateOrderCommand : IRequest<Guid>
{
    public Guid CustomerId { get; init; }
    public decimal Amount { get; init; }
}

internal sealed class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        Order order = new Order(request.CustomerId, request.Amount);
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
| Class/Struct/Enum | PascalCase | `OrderStatus` |
| Method | PascalCase | `GetOrderById` |
| Property | PascalCase | `CustomerId` |
| Private field | `_` prefix + camelCase | `_unitOfWork` |
| Private static field | PascalCase | `MaxRetryCount` |
| Parameter | camelCase | `orderId` |
| Local variable | camelCase | `orderCount` |
| Constant | PascalCase | `MaxRetryCount` |

---

## Checklist

When generating or reviewing C# code:

- [ ] Explicit types used (no `var`)
- [ ] File-scoped namespace with usings inside
- [ ] System usings sorted first
- [ ] Private fields use `_` prefix (no `this.`)
- [ ] Braces on all control statements
- [ ] Block body for methods (no expression-bodied)
- [ ] No primary constructors
- [ ] No primary constructors
- [ ] Block-body constructors and methods
- [ ] Expression-body for properties and accessors
- [ ] Readonly fields where applicable
- [ ] Pattern matching where applicable
- [ ] No multiple blank lines
- [ ] Private fields prefixed with `_`
- [ ] `DateTimeOffset` used instead of `DateTime` for all timestamps
