---
name: dotnet-feature
description: >
  Add new features to existing .NET 9/10 clean architecture solutions. Use this skill when the user
  wants to add a new endpoint, command, query, entity, or any feature across layers — with or
  without MediatR, matching the solution's existing conventions. Trigger on
  phrases like "add feature", "create endpoint", "new command", "new query", "add entity",
  "implement", "create handler", "add controller action", or any request to extend an existing
  .NET solution with new functionality.
---

# Feature Implementation Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

You implement new features in .NET 9/10 clean architecture solutions. Each feature touches multiple layers and follows the established patterns.

**PREREQUISITES:** Load these skills before implementing features:
- `dotnet-architecture` — for layer structure, where code belongs, dispatch style, and target-framework rules
- `dotnet-code-style` — for code conventions
- `dotnet-mediatr` — **only if the solution uses MediatR** (see Step 0)
- `dotnet-fluent-validation` — for validators (if the solution uses FluentValidation)
- `dotnet-ef-core` — if feature involves database entities
- `dotnet-unit-testing` / `dotnet-integration-testing` — for the tests that ship with the feature

---

## Step 0 — Detect the Solution's Conventions (MANDATORY on existing code)

Read the solution before writing anything. Match what exists — a feature must look like its neighbours.

| Check | How | Consequence |
|-------|-----|-------------|
| Target framework | `<TargetFramework>` in `.csproj` / `Directory.Build.props`, `global.json` | Only use APIs/C# features for that version (`dotnet-architecture` → *Target Framework & Existing Projects*) |
| Dispatch style | `MediatR` package reference, `IRequestHandler<`, `ISender` usages | **Found** → MediatR templates below. **Not found** → application-service templates in `references/application-services.md`. Never add MediatR. |
| Validation | `FluentValidation` reference, `AbstractValidator<` | Not found → follow the project's existing validation approach (DataAnnotations, manual checks) |
| Endpoints | `ControllerBase` subclasses vs `MapGet`/`MapPost` minimal APIs | Add the endpoint the same way the neighbouring features do |
| Data access | Repository + UoW, or `DbContext` injected directly into handlers/services | Follow the existing pattern; don't introduce repositories into a solution that uses `DbContext` directly (or vice versa) |
| Tests | `tests/` projects, xUnit/NUnit/MSTest, mocking library | Add tests in the existing projects with the existing libraries |

If two styles coexist (e.g. older features use services, newer use MediatR), follow the style of the area you're changing and mention the inconsistency to the user.

---

## Feature Implementation Checklist

When adding a new feature, follow this order:

1. **Domain** — add entity / value object / enum if needed
2. **Application.Contracts** — add repository or service interface if needed; add DTOs
3. **Application** — MediatR style: `static class FeatureName` with `Command`/`Query`, `Validator`, `Handler`. Application-service style: request record + validator + method on `I<Aggregate>Service` / `<Aggregate>Service` (see `references/application-services.md`)
4. **Infrastructure.Db** — implement any new interfaces; add EF entity config and migration if new entity
5. **Infrastructure.Http** — (if applicable) implement external service client
6. **Presentation.Api** — add action to relevant controller or create a new controller
7. **Presentation.Consumers** — (if applicable) add consumer if the feature is triggered by a message
8. **Tests** — unit tests for domain logic, handler/service and validator (`dotnet-unit-testing`); an integration test per new endpoint (`dotnet-integration-testing`)

The code templates below show the **MediatR style**.

---

## Feature File Structure

For a feature named `CreateOrder`, the files would be:

```
src/
  Domain/ProjectName.Domain/
    Orders/
      Order.cs                              # Entity
      OrderStatus.cs                        # Enum
  Application/
    ProjectName.Application.Contracts/
      Persistence/
        IOrderRepository.cs                 # Repository interface
      Dtos/
        OrderDto.cs                         # DTOs
    ProjectName.Application/
      Orders/
        CreateOrder.cs                      # Command + Validator + Handler
        GetOrderById.cs                     # Query + Handler
  Infrastructure/
    ProjectName.Infrastructure.Db/
      Persistence/
        OrderRepository.cs                  # Repository implementation
      Configurations/
        OrderConfiguration.cs               # EF entity config
  Presentation/
    ProjectName.Presentation.Api/
      Controllers/
        Orders/
          v1/
            OrdersController.cs             # Controller with endpoints
```

---

## Code Templates

### Domain Entity

```csharp
// src/Domain/ProjectName.Domain/Orders/Order.cs
namespace ProjectName.Domain.Orders;

using System;

public sealed class Order
{
    public Guid Id { get; private set; }
    public Guid CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    public decimal Total { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // EF Core requires parameterless constructor
    private Order()
    {
    }

    public Order(Guid customerId, decimal total)
    {
        Id = Guid.NewGuid();
        CustomerId = customerId;
        Total = total;
        Status = OrderStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    public void Confirm()
    {
        if (Status != OrderStatus.Pending)
        {
            throw new InvalidOperationException("Only pending orders can be confirmed.");
        }

        Status = OrderStatus.Confirmed;
    }

    public void Cancel()
    {
        Status = OrderStatus.Cancelled;
    }
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Shipped,
    Cancelled
}
```

### Repository Interface (Application.Contracts)

```csharp
// src/Application/ProjectName.Application.Contracts/Persistence/IOrderRepository.cs
namespace ProjectName.Application.Contracts.Persistence;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ProjectName.Domain.Orders;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Order>> GetByCustomerAsync(Guid customerId, CancellationToken ct = default);
    void Add(Order order);
    void Remove(Order order);
}
```

### DTO (Application.Contracts)

```csharp
// src/Application/ProjectName.Application.Contracts/Dtos/OrderDto.cs
namespace ProjectName.Application.Contracts.Dtos;

using System;

public sealed record OrderDto(
    Guid Id,
    Guid CustomerId,
    string Status,
    decimal Total,
    DateTime CreatedAt);
```

### Command with Validator and Handler (Application)

```csharp
// src/Application/ProjectName.Application/Orders/CreateOrder.cs
namespace ProjectName.Application.Orders;

using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Orders;

public static class CreateOrder
{
    public sealed record Command(Guid CustomerId, decimal Total) : IRequest<Guid>;

    internal sealed class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.CustomerId)
                .NotEmpty()
                .WithMessage("Customer ID is required.");

            RuleFor(x => x.Total)
                .GreaterThan(0)
                .WithMessage("Total must be greater than zero.");
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
            Order order = new(request.CustomerId, request.Total);

            _unitOfWork.Orders.Add(order);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return order.Id;
        }
    }
}
```

### Query with Handler (Application)

```csharp
// src/Application/ProjectName.Application/Orders/GetOrderById.cs
namespace ProjectName.Application.Orders;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using ProjectName.Application.Contracts.Dtos;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Orders;

public static class GetOrderById
{
    public sealed record Query(Guid Id) : IRequest<OrderDto?>;

    internal sealed class Handler : IRequestHandler<Query, OrderDto?>
    {
        private readonly IOrderRepository _orderRepository;

        public Handler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<OrderDto?> Handle(Query request, CancellationToken cancellationToken)
        {
            Order? order = await _orderRepository.GetByIdAsync(request.Id, cancellationToken);

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
}
```

### Repository Implementation (Infrastructure.Db)

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Persistence/OrderRepository.cs
namespace ProjectName.Infrastructure.Db.Persistence;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Orders;

internal sealed class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;

    public OrderRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Orders.FindAsync([id], ct);
    }

    public async Task<IReadOnlyList<Order>> GetByCustomerAsync(Guid customerId, CancellationToken ct = default)
    {
        return await _db.Orders
            .AsNoTracking()
            .Where(o => o.CustomerId == customerId)
            .ToListAsync(ct);
    }

    public void Add(Order order)
    {
        _db.Orders.Add(order);
    }

    public void Remove(Order order)
    {
        _db.Orders.Remove(order);
    }
}
```

### EF Entity Configuration (Infrastructure.Db)

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Configurations/OrderConfiguration.cs
namespace ProjectName.Infrastructure.Db.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjectName.Domain.Orders;

internal sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Id)
            .ValueGeneratedNever();

        builder.Property(o => o.CustomerId)
            .IsRequired();

        builder.Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(o => o.Total)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(o => o.CreatedAt)
            .IsRequired();

        builder.HasIndex(o => o.CustomerId);
    }
}
```

### Controller (Presentation.Api)

```csharp
// src/Presentation/ProjectName.Presentation.Api/Controllers/Orders/v1/OrdersController.cs
namespace ProjectName.Presentation.Api.Controllers.Orders.v1;

using System;
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Contracts.Dtos;
using ProjectName.Application.Orders;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class OrdersController : ControllerBase
{
    private readonly ISender _sender;

    public OrdersController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Creates a new order.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrder.Command command,
        CancellationToken ct)
    {
        Guid id = await _sender.Send(command, ct);
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
        OrderDto? order = await _sender.Send(new GetOrderById.Query(id), ct);
        return order is null ? NotFound() : Ok(order);
    }
}
```

---

## Request Flow Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Controller    │────▶│ MediatR Pipeline │────▶│     Handler     │
│ POST /api/orders│     │ (Validation)     │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  HTTP 201       │◀────│   Domain Entity  │◀────│   Repository    │
│  Location: id   │     │   new Order()    │     │   Add + Save    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Adding a Migration After Entity Changes

When you add or modify an entity:

```bash
# Add migration
dotnet ef migrations add AddOrderEntity \
  --project src/Infrastructure/ProjectName.Infrastructure.Db \
  --startup-project src/ProjectName.Startup \
  --output-dir Migrations

# Apply migration
dotnet ef database update \
  --project src/Infrastructure/ProjectName.Infrastructure.Db \
  --startup-project src/ProjectName.Startup
```

---

## UnitOfWork Pattern

If using UnitOfWork, add to Application.Contracts:

```csharp
// src/Application/ProjectName.Application.Contracts/Persistence/IUnitOfWork.cs
namespace ProjectName.Application.Contracts.Persistence
{
    using System.Threading;
    using System.Threading.Tasks;

    public interface IUnitOfWork
    {
        IOrderRepository Orders { get; }
        // Add more repositories as needed
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
```

And implement in Infrastructure.Db:

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Persistence/UnitOfWork.cs
namespace ProjectName.Infrastructure.Db.Persistence
{
    using System.Threading;
    using System.Threading.Tasks;
    using ProjectName.Application.Contracts.Persistence;

    internal sealed class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext db;

        public UnitOfWork(AppDbContext db, IOrderRepository orders)
        {
            this.db = db;
            this.Orders = orders;
        }

        public IOrderRepository Orders { get; }

        public Task SaveChangesAsync(CancellationToken ct = default)
        {
            return this.db.SaveChangesAsync(ct);
        }
    }
}
```

Register in Infrastructure.Db Module:

```csharp
services.AddScoped<IOrderRepository, OrderRepository>();
services.AddScoped<IUnitOfWork, UnitOfWork>();
```

---

## Feature Implementation Questions

When implementing a feature, ask:

1. **What entity/aggregate?** — New or existing?
2. **Command or Query?** — Write (changes state) or Read (returns data)?
3. **What validation?** — Required fields, business rules?
4. **What response?** — ID, DTO, status code?
5. **Requires external service?** — HTTP client needed?
6. **Which dispatch style does this solution use?** — MediatR or application services (Step 0)?

---

## Adding New Packages (CPM)

If a feature requires a new NuGet package:

1. **Add to Directory.Packages.props** (solution root):
   ```xml
   <PackageVersion Include="NewPackage" Version="1.0.0" />
   ```

2. **Add to project** (no version needed):
   ```bash
   dotnet add src/Application/ProjectName.Application package NewPackage
   ```

The solution uses Central Package Management — all versions are defined centrally in `Directory.Packages.props`.
