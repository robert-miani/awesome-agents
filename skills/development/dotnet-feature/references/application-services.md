# Application-Service Style (no MediatR)

Use these templates when the solution has **no MediatR reference** (see Step 0 in `SKILL.md`).
They implement the same `CreateOrder` / `GetOrderById` feature as the MediatR templates, so
Domain, Application.Contracts, Infrastructure.Db and the migration steps are unchanged — only the
Application layer, its registration, and the controller differ.

## Rules

- One `public interface I<Aggregate>Service` + one `internal sealed class <Aggregate>Service` per
  aggregate, in `Application/<Aggregate>/`. Add a method per use case; split the service when it
  grows past ~7 methods or mixes unrelated responsibilities.
- Request records are `public sealed record <UseCase>Request` next to the service. Responses reuse
  DTOs from `Application.Contracts/Dtos`.
- Validators are `internal sealed class <UseCase>RequestValidator`, injected as `IValidator<T>`
  and called at the **start** of the method — there is no pipeline behaviour to do it for you.
- Every method takes a `CancellationToken` and passes it on.
- Controllers inject the interface, never the implementation.
- Follow `dotnet-code-style` (file-scoped namespaces with usings above them, `var` only when the
  type is apparent, braces always, `_` field prefix).

## File Structure

```
src/Application/ProjectName.Application/
  Orders/
    IOrderService.cs              # Public contract used by Presentation
    OrderService.cs               # internal sealed implementation
    CreateOrderRequest.cs         # Request record + validator
  Module.cs                       # Registers services and validators
```

## Request + Validator

```csharp
// src/Application/ProjectName.Application/Orders/CreateOrderRequest.cs
using System;
using FluentValidation;

namespace ProjectName.Application.Orders;

public sealed record CreateOrderRequest(Guid CustomerId, decimal Total);

internal sealed class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty()
            .WithMessage("Customer ID is required.");

        RuleFor(x => x.Total)
            .GreaterThan(0)
            .WithMessage("Total must be greater than zero.");
    }
}
```

## Service Interface

```csharp
// src/Application/ProjectName.Application/Orders/IOrderService.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using ProjectName.Application.Contracts.Dtos;

namespace ProjectName.Application.Orders;

public interface IOrderService
{
    Task<Guid> CreateAsync(CreateOrderRequest request, CancellationToken ct);

    Task<OrderDto?> GetByIdAsync(Guid id, CancellationToken ct);
}
```

## Service Implementation

```csharp
// src/Application/ProjectName.Application/Orders/OrderService.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using ProjectName.Application.Contracts.Dtos;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Orders;
using ValidationException = ProjectName.Blocks.Exceptions.ValidationException;

namespace ProjectName.Application.Orders;

internal sealed class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IOrderRepository _orderRepository;
    private readonly IValidator<CreateOrderRequest> _createValidator;

    public OrderService(
        IUnitOfWork unitOfWork,
        IOrderRepository orderRepository,
        IValidator<CreateOrderRequest> createValidator)
    {
        _unitOfWork = unitOfWork;
        _orderRepository = orderRepository;
        _createValidator = createValidator;
    }

    public async Task<Guid> CreateAsync(CreateOrderRequest request, CancellationToken ct)
    {
        ValidationResult validation = await _createValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            throw new ValidationException(validation.ToDictionary());
        }

        Order order = new(request.CustomerId, request.Total);

        _unitOfWork.Orders.Add(order);
        await _unitOfWork.SaveChangesAsync(ct);

        return order.Id;
    }

    public async Task<OrderDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        Order? order = await _orderRepository.GetByIdAsync(id, ct);

        if (order is null)
        {
            return null;
        }

        return new OrderDto(
            order.Id,
            order.CustomerId,
            order.Status.ToString(),
            order.Total,
            order.CreatedAt);
    }
}
```

If the solution has no custom `ValidationException` (no `dotnet-error-handling` Blocks project),
replace the validation block with `await _createValidator.ValidateAndThrowAsync(request, ct);`
and check that the global error handler maps `FluentValidation.ValidationException` to 400.

## Module Registration

```csharp
// src/Application/ProjectName.Application/Module.cs
using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Application.Orders;

namespace ProjectName.Application;

public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        Assembly assembly = typeof(Module).Assembly;

        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);

        services.AddScoped<IOrderService, OrderService>();

        return services;
    }
}
```

Register each new service explicitly — one line per service keeps the composition root readable
and makes a missing registration fail fast at startup with a clear DI error.

## Controller

```csharp
// src/Presentation/ProjectName.Presentation.Api/Controllers/Orders/v1/OrdersController.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Contracts.Dtos;
using ProjectName.Application.Orders;

namespace ProjectName.Presentation.Api.Controllers.Orders.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Creates a new order.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrderRequest request,
        CancellationToken ct)
    {
        Guid id = await _orderService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    /// <summary>
    /// Gets an order by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        OrderDto? order = await _orderService.GetByIdAsync(id, ct);
        return order is null ? NotFound() : Ok(order);
    }
}
```

## Request Flow

```
Controller ──▶ IOrderService ──▶ validator.ValidateAsync ──▶ Domain entity ──▶ Repository / UoW
   POST            (DI)            (first line of method)      new Order()        Add + Save
```

## Testing

- Unit-test `OrderService` directly with substituted `IUnitOfWork` / `IOrderRepository` and a
  **real** `CreateOrderRequestValidator` instance (validators are cheap and deterministic).
  The service is `internal`, so the Application project needs
  `<InternalsVisibleTo Include="ProjectName.Application.UnitTests" />` — see `dotnet-unit-testing`.
- Cover the endpoint with an integration test — see `dotnet-integration-testing`.
