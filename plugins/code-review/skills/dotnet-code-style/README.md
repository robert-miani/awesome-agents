# .NET Code Style

## Description

Code style and formatting conventions for C# projects targeting .NET 9/10, aligned with Microsoft's official [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions). The rules are encoded in the scaffold's `.editorconfig` and enforced at build time (`EnforceCodeStyleInBuild`). In existing repositories, the repository's own `.editorconfig` takes precedence.

## When to Use

- Writing new C# code that should follow project conventions
- Reviewing C# code for style consistency
- Refactoring code to match established patterns
- Any C# code generation task (apply these conventions automatically)

## Usage

Activate this skill whenever generating or reviewing C# code. Key rules:

- File-scoped namespaces (`namespace Foo;`), with usings **outside** the namespace and System first
- `var` only when the type is apparent from the right-hand side; otherwise use explicit types (always in `foreach` and for built-in types)
- Braces always, even on single-line `if`
- `_` prefix for private fields, no `this.`
- Primary constructors are allowed on C# 12+; their parameters are never reassigned
- Expression bodies only for single-line members
- `DateTimeOffset` for timestamps

## Example

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace ProjectName.Application.Orders;

public static class CreateOrder
{
    public sealed record Command(string Name, decimal Amount) : IRequest<Guid>;

    internal sealed class Handler : IRequestHandler<Command, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;

        public Handler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
        {
            Order order = Order.Create(request.Name, request.Amount);
            _unitOfWork.Orders.Add(order);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return order.Id;
        }
    }
}
```

## Requirements

- .NET 9 or 10 (the C# 12+ features apply only where the target framework supports them)
- `<ImplicitUsings>disable</ImplicitUsings>` and `<EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>` in Directory.Build.props
