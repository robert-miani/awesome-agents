---
name: dotnet-fluent-validation
description: >
  Expert guidance for FluentValidation in .NET 8/9. Use this skill whenever the user is working
  with FluentValidation — including validators, rules, custom validators, async validation, or
  wiring FluentValidation into ASP.NET Core or MediatR. Trigger on phrases like "FluentValidation",
  "AbstractValidator", "RuleFor", "RuleForEach", "ChildRules", "MustAsync", "validator",
  "validation rules", or any code that references the FluentValidation package.
---

# FluentValidation Skill (.NET 8/9)

You are an expert in FluentValidation 11+. Validators are `internal sealed`, co-located with their command/query inside a static outer class. Always register with `includeInternalTypes: true` from the application layer via a `Module` extension method.

---

## Guiding Principles

1. **internal sealed validators** — validators are never public; they are implementation details.
2. **Co-locate by feature** — validator lives in the same static class as its command/query.
3. **Register from the application layer** — use a `Module` extension, never scatter registrations in `Program.cs`.
4. **includeInternalTypes: true** — required so the DI scanner picks up internal validators.

---

## Setup

```csharp
// NuGet: FluentValidation.DependencyInjectionExtensions

// Application/Module.cs
public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(Module).Assembly;

        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);

        return services;
    }
}

// Program.cs
builder.Services.AddApplication();
```

---

## Validator Structure

```csharp
public static class CreateOrder
{
    public sealed record Command(
        Guid CustomerId,
        IReadOnlyList<OrderLineDto> Lines) : IRequest<Guid>;

    internal sealed class Validator : AbstractValidator<Command>
    {
        internal Validator()
        {
            RuleFor(x => x.CustomerId).NotEmpty();
            RuleFor(x => x.Lines).NotEmpty().WithMessage("Order must have at least one line.");
            RuleForEach(x => x.Lines).ChildRules(line =>
            {
                line.RuleFor(l => l.ProductId).NotEmpty();
                line.RuleFor(l => l.Quantity).GreaterThan(0);
            });
        }
    }
}
```

---

## Common Rules

```csharp
internal sealed class Validator : AbstractValidator<Command>
{
    internal Validator(IUserRepository userRepo)
    {
        // Strings
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.PostCode).Matches(@"^\d{5}$").WithMessage("Must be a 5-digit postcode.");

        // Numbers
        RuleFor(x => x.Age).InclusiveBetween(18, 120);
        RuleFor(x => x.Price).GreaterThan(0).PrecisionScale(18, 2, false);

        // Collections
        RuleFor(x => x.Items)
            .NotEmpty()
            .Must(i => i.Count <= 50).WithMessage("Max 50 items.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.Sku).NotEmpty();
            item.RuleFor(i => i.Qty).GreaterThan(0);
        });

        // Conditional
        RuleFor(x => x.CompanyName).NotEmpty().When(x => x.IsCompany);

        // Cross-property
        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .WithMessage("End date must be after start date.");

        // Async — e.g. uniqueness check
        RuleFor(x => x.Email)
            .MustAsync(async (email, ct) => !await userRepo.ExistsAsync(email, ct))
            .WithMessage("Email is already registered.");
    }
}
```

---

## Custom Validators

```csharp
// Reusable rule as extension method
internal static class ValidatorExtensions
{
    internal static IRuleBuilderOptions<T, string> ValidSlug<T>(
        this IRuleBuilder<T, string> rule) =>
        rule.Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Must be a valid slug (lowercase, hyphens only).");
}

// Usage
RuleFor(x => x.Slug).NotEmpty().ValidSlug();

// Reusable standalone validator
internal sealed class MoneyValidator : AbstractValidator<Money>
{
    internal MoneyValidator()
    {
        RuleFor(x => x.Amount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Currency).NotEmpty().Length(3);
    }
}

// Compose into parent validator
RuleFor(x => x.Price).SetValidator(new MoneyValidator());
```

---

## Validating Manually (outside pipeline)

```csharp
internal sealed class OrderService(IValidator<CreateOrder.Command> validator)
{
    public async Task DoSomethingAsync(CreateOrder.Command cmd, CancellationToken ct)
    {
        var result = await validator.ValidateAsync(cmd, ct);
        if (!result.IsValid)
        {
            var errors = result.ToDictionary(); // key: property, value: string[]
            // handle errors
        }
    }
}
```
