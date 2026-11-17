# .NET Code Style

## Description

Code style and formatting conventions for C# projects targeting .NET 9/10. Covers explicit types (no `var`), file-scoped namespaces, using placement, naming conventions, brace rules, and patterns to avoid (primary constructors, expression-bodied methods).

## When to Use

- Writing new C# code that should follow project conventions
- Reviewing C# code for style consistency
- Refactoring code to match established patterns
- Any C# code generation task (apply these conventions automatically)

## Usage

Activate this skill whenever generating or reviewing C# code. Key rules:

- Explicit types — no `var`
- File-scoped namespaces (`namespace Foo;`)
- Usings inside namespace, System first
- `_` prefix for private fields
- Braces always (even single-line `if`)
- No primary constructors, no expression-bodied methods

## Example

```csharp
namespace ProjectName.Application.Orders;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

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

- .NET 9 or 10
- `<ImplicitUsings>disable</ImplicitUsings>` in Directory.Build.props
