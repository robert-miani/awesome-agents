# .NET MediatR

## Description

Expert guidance for MediatR 12+ in .NET 8/9. Uses CQRS — commands mutate state, queries return data. Co-locates command/query, validator, and handler in one static class. Never uses notifications (`INotification` / `INotificationHandler`).

## When to Use

- Creating commands or queries with MediatR
- Implementing CQRS patterns
- Setting up MediatR pipeline behaviours (logging, validation, performance)
- Wiring MediatR into a .NET clean architecture solution
- Reviewing handler/command organization

## Usage

Activate this skill when working with MediatR. Key rules:

- Commands mutate, queries read
- Co-locate by feature in one static class (e.g., `CreateOrder`)
- `Command`/`Query` = `public sealed record`
- `Handler`/`Validator` = `internal sealed class`
- Inject `ISender`, not `IMediator`
- No notifications — use direct calls or pipeline behaviours instead
- Register in `Application/Module.cs`

## Example

```csharp
public static class CreateOrder
{
    public sealed record Command(string Name, decimal Amount) : IRequest<Guid>;

    internal sealed class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Amount).GreaterThan(0);
        }
    }

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

- .NET 8 or 9
- `MediatR` NuGet package
- `FluentValidation.DependencyInjectionExtensions` (for validation pipeline)
