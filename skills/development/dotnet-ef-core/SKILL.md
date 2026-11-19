---
name: dotnet-ef-core
description: >
  Expert guidance for Entity Framework Core targeting .NET 9/10. Use this skill whenever the
  user is working with EF Core — including DbContext setup, entity configuration, relationships,
  migrations, querying, performance tuning, transactions, raw SQL, or testing with EF Core.
  Trigger on phrases like "DbContext", "EF Core", "Entity Framework", "migration", "fluent API",
  "navigation property", "Include", "lazy loading", "eager loading", "query", "DbSet", "OnModelCreating",
  "HasOne", "HasMany", "owned entity", "value object", "connection string", "database seeding",
  "N+1 problem", or any code that references Microsoft.EntityFrameworkCore. Also trigger when
  the user pastes a DbContext class or asks about database schema design in a .NET project.
---

# Entity Framework Core Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

You are an expert EF Core developer. Always target **EF Core 9 or 10** (match the major version to the target framework). Favour code-first with
Fluent API configuration. Write queries that translate cleanly to SQL — never cause N+1 or
client-side evaluation silently.

---

## Guiding Principles

1. **Fluent API over Data Annotations** — keep entity classes free of infrastructure concerns.
2. **Explicit loading strategies** — always decide between eager / explicit / split query loading; never rely on lazy loading in production.
3. **No-tracking for reads** — use `AsNoTracking()` or `AsNoTrackingWithIdentityResolution()` for all read-only queries.
4. **Pagination always** — never return unbounded result sets; always use `Skip` + `Take` or keyset pagination.
5. **Migrations are code** — review generated migrations; never apply blindly to production.
6. **Compiled queries for hot paths** — pre-compile frequently executed parameterised queries.

---

## DbContext Setup

```csharp
// AppDbContext.cs
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Auto-discover all IEntityTypeConfiguration<T> in this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}

// Program.cs / DI registration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(                                      // or UseSqlServer, UseSqlite, etc.
        builder.Configuration.GetConnectionString("Default"),
        npgsql => npgsql.EnableRetryOnFailure(maxRetryCount: 3))
    .UseSnakeCaseNamingConvention()                         // EF Core naming convention pkg
    .EnableSensitiveDataLogging(builder.Environment.IsDevelopment())
    .EnableDetailedErrors(builder.Environment.IsDevelopment()));
```

---

## Entity Configuration (Fluent API)

```csharp
// Configurations/OrderConfiguration.cs
public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Id)
               .HasColumnName("id")
               .ValueGeneratedOnAdd();

        builder.Property(o => o.Status)
               .HasConversion<string>()           // store enum as string
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(o => o.Total)
               .HasColumnType("numeric(18,2)")
               .IsRequired();

        // Owned entity (value object — no separate table by default)
        builder.OwnsOne(o => o.ShippingAddress, addr =>
        {
            addr.Property(a => a.Street).HasMaxLength(200).IsRequired();
            addr.Property(a => a.City).HasMaxLength(100).IsRequired();
            addr.Property(a => a.PostCode).HasMaxLength(20).IsRequired();
        });

        // Relationships
        builder.HasOne(o => o.Customer)
               .WithMany(c => c.Orders)
               .HasForeignKey(o => o.CustomerId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Items)
               .WithOne(i => i.Order)
               .HasForeignKey(i => i.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

        // Index
        builder.HasIndex(o => o.CustomerId);
        builder.HasIndex(o => new { o.Status, o.CreatedAt });

        // Soft delete query filter
        builder.HasQueryFilter(o => !o.DeletedAt.HasValue);

        // Concurrency token
        builder.Property(o => o.RowVersion)
               .IsRowVersion();
    }
}
```

---

## Relationships Cheat Sheet

| Relationship | Configuration |
|---|---|
| One-to-Many | `HasOne(...).WithMany(...).HasForeignKey(...)` |
| Many-to-Many | `HasMany(...).WithMany(...)` — EF creates join table automatically |
| Many-to-Many (explicit join) | Map join entity + `HasMany(...).WithMany(...).UsingEntity<OrderTag>(...)` |
| One-to-One | `HasOne(...).WithOne(...).HasForeignKey<Dependant>(...)` |
| Owned entity | `OwnsOne(...)` / `OwnsMany(...)` — stored in same or separate table |
| TPH inheritance | `builder.HasDiscriminator<string>("type").HasValue<SubType>("sub")` |

---

## Querying

### Read-Only Queries (no tracking)
```csharp
// Single item
Order? order = await db.Orders
    .AsNoTracking()
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .FirstOrDefaultAsync(o => o.Id == id, ct);

// Projection — always project to a DTO/record for reads
List<OrderSummary> summaries = await db.Orders
    .AsNoTracking()
    .Where(o => o.CustomerId == customerId && o.Status == OrderStatus.Completed)
    .OrderByDescending(o => o.CreatedAt)
    .Select(o => new OrderSummary(o.Id, o.Total, o.CreatedAt))   // translated to SQL SELECT
    .ToListAsync(ct);
```

### Pagination

```csharp
// Offset pagination (simple, use for low-volume or non-real-time data)
List<Order> page = await db.Orders
    .AsNoTracking()
    .OrderBy(o => o.CreatedAt)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(ct);

// Keyset / cursor pagination (preferred for large datasets)
List<Order> nextPage = await db.Orders
    .AsNoTracking()
    .Where(o => o.CreatedAt > lastSeenCreatedAt || 
               (o.CreatedAt == lastSeenCreatedAt && o.Id > lastSeenId))
    .OrderBy(o => o.CreatedAt).ThenBy(o => o.Id)
    .Take(pageSize)
    .ToListAsync(ct);
```

### Avoiding N+1

```csharp
// BAD — N+1: EF fires one query per order to load items
foreach (Order order in orders)
{
    Console.WriteLine(order.Items.Count);   // lazy loads each time
}

// GOOD — eager load in single query
List<Order> orders = await db.Orders
    .Include(o => o.Items)
    .ToListAsync(ct);

// GOOD — split query for large collections (avoids cartesian explosion)
List<Order> orders = await db.Orders
    .AsSplitQuery()
    .Include(o => o.Items)
    .Include(o => o.Customer)
    .ToListAsync(ct);
```

### Compiled Queries (hot paths)
```csharp
private static readonly Func<AppDbContext, Guid, Task<Order?>> GetOrderById =
    EF.CompileAsyncQuery((AppDbContext db, Guid id) =>
        db.Orders.Include(o => o.Items).FirstOrDefault(o => o.Id == id));

// Usage
Order? order = await GetOrderById(db, orderId);
```

### Raw SQL (when LINQ isn't enough)
```csharp
// Parameterised — safe from injection
List<Order> orders = await db.Orders
    .FromSqlInterpolated($"SELECT * FROM orders WHERE customer_id = {customerId}")
    .AsNoTracking()
    .ToListAsync(ct);

// Non-entity result sets
List<OrderStats> stats = await db.Database
    .SqlQuery<OrderStats>($"SELECT status, COUNT(*) as count FROM orders GROUP BY status")
    .ToListAsync(ct);

// Execute non-query
await db.Database.ExecuteSqlInterpolatedAsync(
    $"UPDATE orders SET status = 'archived' WHERE created_at < {cutoff}", ct);
```

---

## Saving Data

```csharp
// Add
Order order = Order.Create(request);
db.Orders.Add(order);
await db.SaveChangesAsync(ct);

// Update (tracked entity)
order.UpdateStatus(OrderStatus.Shipped);
await db.SaveChangesAsync(ct);

// Update (disconnected — attach + mark modified)
db.Entry(order).State = EntityState.Modified;
await db.SaveChangesAsync(ct);

// Delete
db.Orders.Remove(order);
await db.SaveChangesAsync(ct);

// Bulk operations (.NET 7+ ExecuteUpdate / ExecuteDelete — no tracking required)
await db.Orders
    .Where(o => o.CreatedAt < cutoffDate && o.Status == OrderStatus.Cancelled)
    .ExecuteDeleteAsync(ct);

await db.Orders
    .Where(o => o.CustomerId == customerId)
    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, OrderStatus.Archived), ct);
```

---

## Transactions

```csharp
// Explicit transaction
await using IDbContextTransaction tx = await db.Database.BeginTransactionAsync(ct);
try
{
    db.Orders.Add(order);
    await db.SaveChangesAsync(ct);

    await reservationService.ReserveStockAsync(order.Items, ct);
    await tx.CommitAsync(ct);
}
catch
{
    await tx.RollbackAsync(ct);
    throw;
}

// Ambient transaction (for cross-service coordination — use sparingly)
using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
await db.SaveChangesAsync(ct);
scope.Complete();
```

---

## Migrations

```bash
# Add a migration
dotnet ef migrations add AddOrderShippingAddress --project src/Infrastructure --startup-project src/Api

# Review the generated file before applying!

# Apply to dev database
dotnet ef database update --project src/Infrastructure --startup-project src/Api

# Generate SQL script for production (recommended over direct update)
dotnet ef migrations script --idempotent -o migrations.sql

# Programmatic migration on startup (for containers/CI)
# In Program.cs:
await using AsyncServiceScope scope = app.Services.CreateAsyncScope();
await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
```

**Migration tips:**
- Always review auto-generated migrations — EF may scaffold a drop/recreate instead of an `ALTER`.
- Add custom `migrationBuilder.Sql(...)` for data migrations.
- Never delete migration files that have been applied to any environment.

---

## Performance Tips

| Issue | Fix |
|---|---|
| N+1 queries | Use `Include` / `AsSplitQuery()` or project to DTO |
| Cartesian explosion | Use `AsSplitQuery()` on multi-collection includes |
| Full table scan | Add index via `HasIndex(...)` in configuration |
| Tracking overhead on reads | `AsNoTracking()` or `AsNoTrackingWithIdentityResolution()` |
| Repeated parameterised query | Use `EF.CompileAsyncQuery(...)` |
| Large bulk ops | Use `ExecuteUpdateAsync` / `ExecuteDeleteAsync` |
| Slow `SaveChanges` | Batch with `AddRange`, avoid calling `SaveChanges` in a loop |

---

## Testing with EF Core

Test EF Core code against the **same database engine as production** — PostgreSQL or SQL Server in a Testcontainers container, reset between tests with Respawn. Setup, fixtures and examples: `dotnet-integration-testing`.

| Option | Use for | Why not for everything |
|--------|---------|------------------------|
| Testcontainers (real engine) + Respawn | Repositories, queries, migrations, constraints, endpoints | — (default) |
| SQLite in-memory | Only if Docker is unavailable | Different SQL dialect, types and constraint behaviour — false positives and negatives |
| `UseInMemoryDatabase` | Nothing — avoid | Not relational: no SQL translation, no constraints, no transactions; Microsoft discourages it for testing |

Do **not** mock `DbContext` or `DbSet<T>` in unit tests. Unit-test handlers/services against substituted repository interfaces (`dotnet-unit-testing`) and leave EF Core behaviour to integration tests.

---

## Reference Files

| File | When to read |
|------|-------------|
| `references/advanced-mapping.md` | Complex scenarios: TPH/TPT inheritance, table splitting, keyless entities, JSON columns |
| `references/interceptors.md` | Audit logging, soft-delete automation, query hints via EF interceptors |

Read a reference file when the user's question goes beyond the patterns in this file.
