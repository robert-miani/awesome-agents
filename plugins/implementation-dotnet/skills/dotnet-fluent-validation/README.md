# .NET FluentValidation

## Description

Expert guidance for FluentValidation 11+ in .NET 9/10. Validators are `internal sealed`, co-located with their command/query inside a static outer class, and registered with `includeInternalTypes: true` from the application layer.

## When to Use

- Creating validators for commands or queries
- Working with FluentValidation rules (`RuleFor`, `RuleForEach`, `MustAsync`)
- Wiring FluentValidation into MediatR pipeline
- Reviewing validator placement and registration
- Writing custom validation logic with `Must` or `MustAsync`

## Usage

Activate this skill when working with FluentValidation. Key rules:

- Validators are `internal sealed` — never public
- Co-located with the command/query in the same static class
- Registered via `AddValidatorsFromAssembly(assembly, includeInternalTypes: true)`
- Registration lives in `Application/Module.cs`

## Example

```csharp
public static class CreateOrder
{
    public sealed record Command(string Name, decimal Amount) : IRequest<Guid>;

    internal sealed class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Amount)
                .GreaterThan(0);
        }
    }

    internal sealed class Handler : IRequestHandler<Command, Guid> { ... }
}
```

## Requirements

- .NET 9 or 10 (existing projects on older targets: see `dotnet-architecture` → Target Framework & Existing Projects)
- `FluentValidation.DependencyInjectionExtensions` NuGet package
- MediatR with `ValidationBehaviour` pipeline
