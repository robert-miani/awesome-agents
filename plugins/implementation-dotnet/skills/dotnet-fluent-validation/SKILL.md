---
name: dotnet-fluent-validation
description: >
  Expert guidance for FluentValidation in .NET 9/10. Use this skill whenever the user is working
  with FluentValidation — including validators, rules, custom validators, async validation, or
  wiring FluentValidation into ASP.NET Core, MediatR, or plain application services. Trigger on phrases like "FluentValidation",
  "AbstractValidator", "RuleFor", "RuleForEach", "ChildRules", "MustAsync", "validator",
  "validation rules", or any code that references the FluentValidation package.
---

# FluentValidation Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

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
        Assembly assembly = typeof(Module).Assembly;

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

## Validating in Application Services (no MediatR)

In solutions without MediatR there is no `ValidationBehaviour`, so each service method validates its own input first. The validator sits next to its request record (`internal sealed class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>`) and is injected as `IValidator<T>`. Throw the exception type the solution's global error handler already maps to 400 — the `ValidationException` from `dotnet-error-handling` if that skill's pattern is in place:

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using ValidationException = ProjectName.Blocks.Exceptions.ValidationException;

namespace ProjectName.Application.Orders;

internal sealed class OrderService : IOrderService
{
    private readonly IValidator<CreateOrderRequest> _createValidator;

    public OrderService(IValidator<CreateOrderRequest> createValidator)
    {
        _createValidator = createValidator;
    }

    public async Task<Guid> CreateAsync(CreateOrderRequest request, CancellationToken ct)
    {
        ValidationResult result = await _createValidator.ValidateAsync(request, ct);
        if (!result.IsValid)
        {
            throw new ValidationException(result.ToDictionary());
        }

        // ... use case logic
    }
}
```

If the solution has no custom `ValidationException`, use `await _createValidator.ValidateAndThrowAsync(request, ct);` and make sure the error handler maps `FluentValidation.ValidationException` to 400.
