---
name: dotnet-mediatr
description: >
  Expert guidance for MediatR in .NET 9/10. Use this skill only in solutions that already
  reference MediatR — for commands, queries, handlers, pipeline behaviours, or wiring MediatR
  into ASP.NET Core. Trigger on phrases like "MediatR", "IRequest", "IRequestHandler", "ISender",
  "pipeline behaviour", or any code that references the MediatR package. Do not use it to add
  MediatR to a solution that doesn't have it. Never suggest notifications, INotification, or INotificationHandler —
  these are antipatterns; direct calls or pipeline behaviours are always the better choice.
---

# MediatR Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

> **Only for solutions that already use MediatR.** If the solution has no MediatR reference, do not add one — use the application-service style instead (see `dotnet-architecture` → *Dispatch Style*). **Licensing:** MediatR 13+ is commercially licensed and expects a license key; 12.x is the last Apache-2.0 line. Never bump an existing 12.x reference to 13+ without the team confirming its license.

You are an expert in MediatR 12+. Use CQRS — commands mutate state, queries return data. Co-locate command/query and handler in one static class named after the operation with no `Command`/`Query` suffix. `Command`/`Query` records are `public sealed record`. `Validator` and `Handler` are `internal sealed class`. Never suggest `INotification` or `INotificationHandler` — they are an antipattern.

---

## Guiding Principles

1. **Commands mutate, queries read** — a command returns only what the caller needs (e.g. the new ID); a query never causes side effects.
2. **Co-locate by feature** — command/query, validator, and handler live together in one static class.
3. **Public command/query, internal everything else** — `Command`/`Query` are `public sealed record`; `Handler` and `Validator` are `internal sealed class`.
4. **ISender over IMediator** — inject `ISender`; it's a narrower, cleaner contract.
5. **No notifications** — use direct service calls or pipeline behaviours instead.
6. **Register in the application layer** — use a `Module` extension method on the application assembly, not in `Program.cs` directly.

---

## Setup

```csharp
// NuGet: MediatR, FluentValidation.DependencyInjectionExtensions

// Application/Module.cs
public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        Assembly assembly = typeof(Module).Assembly;

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(assembly));

        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

        return services;
    }
}

// Program.cs
builder.Services.AddApplication();
```

---

## Command

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

    internal sealed class Handler(
        IUnitOfWork uow,
        ILogger<Handler> logger) : IRequestHandler<Command, Guid>
    {
        public async Task<Guid> Handle(Command cmd, CancellationToken ct)
        {
            Order order = Order.Create(cmd.CustomerId, cmd.Lines);
            uow.Orders.Add(order);
            await uow.SaveChangesAsync(ct);

            logger.LogInformation("Order {OrderId} created for customer {CustomerId}",
                order.Id, cmd.CustomerId);

            return order.Id;
        }
    }
}

// Command with no return value
public static class CancelOrder
{
    public sealed record Command(Guid OrderId) : IRequest;

    internal sealed class Validator : AbstractValidator<Command>
    {
        internal Validator()
        {
            RuleFor(x => x.OrderId).NotEmpty();
        }
    }

    internal sealed class Handler(IUnitOfWork uow) : IRequestHandler<Command>
    {
        public async Task Handle(Command cmd, CancellationToken ct)
        {
            Order order = await uow.Orders.GetByIdAsync(cmd.OrderId, ct)
                ?? throw new NotFoundException(nameof(Order), cmd.OrderId);

            order.Cancel();
            await uow.SaveChangesAsync(ct);
        }
    }
}
```

---

## Query

```csharp
public static class GetOrderById
{
    public sealed record Query(Guid OrderId) : IRequest<OrderDto?>;

    internal sealed class Validator : AbstractValidator<Query>
    {
        internal Validator()
        {
            RuleFor(x => x.OrderId).NotEmpty();
        }
    }

    internal sealed class Handler(IOrderRepository orders)
        : IRequestHandler<Query, OrderDto?>
    {
        public async Task<OrderDto?> Handle(Query query, CancellationToken ct)
        {
            Order? order = await orders.GetWithItemsAsync(query.OrderId, ct);
            return order is null ? null : OrderDto.From(order);
        }
    }
}

public static class GetOrders
{
    public sealed record Query(
        Guid CustomerId,
        int Page = 1,
        int PageSize = 20) : IRequest<PagedResult<OrderSummaryDto>>;

    internal sealed class Validator : AbstractValidator<Query>
    {
        internal Validator()
        {
            RuleFor(x => x.CustomerId).NotEmpty();
            RuleFor(x => x.Page).GreaterThan(0);
            RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        }
    }

    internal sealed class Handler(IOrderRepository orders)
        : IRequestHandler<Query, PagedResult<OrderSummaryDto>>
    {
        public async Task<PagedResult<OrderSummaryDto>> Handle(Query query, CancellationToken ct) =>
            await orders.GetPagedByCustomerAsync(query.CustomerId, query.Page, query.PageSize, ct);
    }
}
```

---

## Pipeline Behaviours

### Validation Behaviour
```csharp
internal sealed class ValidationBehaviour<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!validators.Any())
        {
            return await next();
        }

        ValidationContext<TRequest> context = new ValidationContext<TRequest>(request);
        List<ValidationFailure> failures = validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count > 0)
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
```

### Logging Behaviour
```csharp
internal sealed class LoggingBehaviour<TRequest, TResponse>(
    ILogger<LoggingBehaviour<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        string name = typeof(TRequest).Name;
        logger.LogInformation("Handling {RequestName}", name);
        TResponse response = await next();
        logger.LogInformation("Handled {RequestName}", name);
        return response;
    }
}
```

### Performance Behaviour
```csharp
internal sealed class PerformanceBehaviour<TRequest, TResponse>(
    ILogger<PerformanceBehaviour<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private const int ThresholdMs = 500;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        Stopwatch sw = Stopwatch.StartNew();
        TResponse response = await next();
        sw.Stop();

        if (sw.ElapsedMilliseconds > ThresholdMs)
        {
            logger.LogWarning("Slow request {RequestName} took {ElapsedMs}ms",
                typeof(TRequest).Name, sw.ElapsedMilliseconds);
        }

        return response;
    }
}
```

---

## Wiring into ASP.NET Core

```csharp
// Minimal API
app.MapPost("/orders", async (CreateOrder.Command cmd, ISender sender, CancellationToken ct) =>
{
    Guid id = await sender.Send(cmd, ct);
    return Results.CreatedAtRoute("GetOrderById", new { id }, new { id });
});

app.MapGet("/orders/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
{
    OrderDto? order = await sender.Send(new GetOrderById.Query(id), ct);
    return order is null ? Results.NotFound() : Results.Ok(order);
});

// Controller
[ApiController]
[Route("api/orders")]
internal sealed class OrdersController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateOrder.Command cmd, CancellationToken ct)
    {
        Guid id = await sender.Send(cmd, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        OrderDto? order = await sender.Send(new GetOrderById.Query(id), ct);
        return order is null ? NotFound() : Ok(order);
    }
}
```
