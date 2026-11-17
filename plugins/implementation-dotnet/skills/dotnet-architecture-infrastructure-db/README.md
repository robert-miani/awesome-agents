# .NET Infrastructure.Db — Repository & Unit of Work

## Description

Repository pattern, Unit of Work, and data access conventions for the Infrastructure.Db layer. Covers repository implementation, `IUnitOfWork` design, DbContext setup (no `DbSet` properties), and strict boundary rules for what belongs in Infrastructure.Db.

## When to Use

- Implementing repositories for aggregate persistence
- Creating repository interfaces in Application.Contracts
- Working with the Unit of Work pattern (`IUnitOfWork`)
- Setting up DbContext with EF Core
- Adding new entity persistence to the data access layer
- Reviewing data access code for pattern violations

## Usage

Activate this skill when working with data access code. It provides:

- Core rules (no `SaveChangesAsync` in repos, `DbSet<T>` via `dbContext.Set<T>()`)
- Repository template with `GetByIdAsync` and `GetByIdSafeAsync` methods
- `IUnitOfWork` interface and implementation patterns
- DbContext clean design (no DbSet properties, auto-discover configurations)
- Clear boundary: what belongs vs. what does NOT belong in Infrastructure.Db

**Prerequisites:** Load `dotnet-architecture` and `dotnet-code-style` first.

## Example

```csharp
// Repository — internal sealed, injected via IUnitOfWork
internal sealed class OrderRepository : IOrderRepository
{
    private readonly DbSet<Order> _orders;

    public OrderRepository(AppDbContext dbContext)
    {
        _orders = dbContext.Set<Order>();
    }

    public Task<Order?> GetByIdAsync(Guid id, CancellationToken ct)
        => _orders.FirstOrDefaultAsync(o => o.Id == id, ct);

    public void Add(Order order) => _orders.Add(order);
}
```

## Requirements

- .NET 9 or 10
- Entity Framework Core 8+
- `dotnet-architecture` skill (prerequisite)
- `dotnet-code-style` skill (prerequisite)
