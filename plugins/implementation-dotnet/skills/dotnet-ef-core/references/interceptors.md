# EF Core — Interceptors

Interceptors run code around EF Core operations without touching entities, repositories or
handlers. Use them for cross-cutting persistence behaviour: audit timestamps, soft delete,
query hints, connection setup. Business rules don't belong here.

| Interceptor | Hooks | Typical use |
|-------------|-------|-------------|
| `SaveChangesInterceptor` | before/after `SaveChanges(Async)` | Audit fields, soft delete, outbox rows |
| `DbCommandInterceptor` | before/after each SQL command | Query hints, slow-query logging |
| `DbConnectionInterceptor` | connection opening/opened/closed | Session context, access tokens |
| `IMaterializationInterceptor` (EF Core 7+) | entity instance created from a query | Injecting services into entities (rarely needed) |

All examples follow `dotnet-code-style` and live in `Infrastructure.Db/Interceptors/`.

---

## Audit Timestamps

Entities expose read-only audit properties; the interceptor writes them through EF's change
tracker, so entities keep their encapsulation.

```csharp
// Domain
public interface IAuditable
{
    DateTimeOffset CreatedAt { get; }

    DateTimeOffset? UpdatedAt { get; }
}
```

```csharp
namespace ProjectName.Infrastructure.Db.Interceptors;

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ProjectName.Domain;

internal sealed class AuditInterceptor : SaveChangesInterceptor
{
    private readonly TimeProvider _timeProvider;

    public AuditInterceptor(TimeProvider timeProvider)
    {
        _timeProvider = timeProvider;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ApplyAudit(DbContext? context)
    {
        if (context is null)
        {
            return;
        }

        DateTimeOffset now = _timeProvider.GetUtcNow();

        foreach (EntityEntry<IAuditable> entry in context.ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property(nameof(IAuditable.CreatedAt)).CurrentValue = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(nameof(IAuditable.UpdatedAt)).CurrentValue = now;
            }
        }
    }
}
```

`TimeProvider` (.NET 8+) is registered with `services.AddSingleton(TimeProvider.System);` and
replaced by `FakeTimeProvider` in tests. On older targets, inject the project's existing clock
abstraction instead.

---

## Soft Delete

Turn deletes of `ISoftDeletable` entities into updates, and hide deleted rows with a query filter.

```csharp
// Domain
public interface ISoftDeletable
{
    DateTimeOffset? DeletedAt { get; }
}
```

```csharp
internal sealed class SoftDeleteInterceptor : SaveChangesInterceptor
{
    private readonly TimeProvider _timeProvider;

    public SoftDeleteInterceptor(TimeProvider timeProvider)
    {
        _timeProvider = timeProvider;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ConvertDeletes(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ConvertDeletes(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ConvertDeletes(DbContext? context)
    {
        if (context is null)
        {
            return;
        }

        DateTimeOffset now = _timeProvider.GetUtcNow();

        foreach (EntityEntry<ISoftDeletable> entry in context.ChangeTracker.Entries<ISoftDeletable>())
        {
            if (entry.State != EntityState.Deleted)
            {
                continue;
            }

            entry.State = EntityState.Modified;
            entry.Property(nameof(ISoftDeletable.DeletedAt)).CurrentValue = now;

            // Owned entities were marked Deleted together with their owner — restore them,
            // otherwise EF nulls out their columns (same table) or deletes their rows.
            foreach (ReferenceEntry reference in entry.References)
            {
                if (reference.TargetEntry is not null
                    && reference.TargetEntry.Metadata.IsOwned()
                    && reference.TargetEntry.State == EntityState.Deleted)
                {
                    reference.TargetEntry.State = EntityState.Unchanged;
                }
            }
        }
    }
}
```

```csharp
// In each soft-deletable entity's configuration
builder.HasQueryFilter(o => o.DeletedAt == null);

// Bypass the filter (admin screens, restore)
List<Order> all = await db.Orders.IgnoreQueryFilters().ToListAsync(ct);
```

Owned references are restored above; owned **collections** (`OwnsMany`) need the same treatment
via `entry.Collections`. Cascade-deleted dependents (separate entities) are converted only if they
implement `ISoftDeletable`; otherwise they are really deleted. Decide per aggregate.

---

## Query Hints and Slow-Query Logging (`DbCommandInterceptor`)

Tag a query with `TagWith`, then act on the tag in the interceptor — only that query is affected.

```csharp
List<Order> orders = await db.Orders
    .TagWith(QueryHints.RobustPlan)
    .Where(o => o.CustomerId == customerId)
    .ToListAsync(ct);
```

```csharp
internal static class QueryHints
{
    public const string RobustPlan = "hint:robust-plan";
}

internal sealed class QueryHintInterceptor : DbCommandInterceptor
{
    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result)
    {
        ApplyHints(command);
        return result;
    }

    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        ApplyHints(command);
        return ValueTask.FromResult(result);
    }

    private static void ApplyHints(DbCommand command)
    {
        // SQL Server syntax; PostgreSQL has no query-level OPTION clause
        if (command.CommandText.Contains(QueryHints.RobustPlan, StringComparison.Ordinal))
        {
            command.CommandText += " OPTION (ROBUST PLAN)";
        }
    }
}
```

For slow-query logging, override `ReaderExecuted(Async)` and log when
`eventData.Duration` exceeds a threshold — but first check whether the database's own tooling
(Query Store, `pg_stat_statements`) or OpenTelemetry tracing already covers it.

---

## Registration

Interceptors that only depend on singletons (like `TimeProvider`) are registered once as
singletons and added through the service-provider overload of `AddDbContext`:

```csharp
// Infrastructure.Db/Module.cs
services.AddSingleton(TimeProvider.System);
services.AddSingleton<AuditInterceptor>();
services.AddSingleton<SoftDeleteInterceptor>();

services.AddDbContext<AppDbContext>((serviceProvider, options) =>
{
    options.UseNpgsql(dbOptions.ConnectionString)
        .AddInterceptors(
            serviceProvider.GetRequiredService<AuditInterceptor>(),
            serviceProvider.GetRequiredService<SoftDeleteInterceptor>());
});
```

If an interceptor needs a **scoped** service (e.g. the current user for `CreatedBy`), register
the interceptor as scoped — the `serviceProvider` passed to the `AddDbContext` callback is the
request scope, so it resolves correctly. Never capture a scoped service in a singleton
interceptor.

---

## Gotchas

- **`ExecuteUpdate` / `ExecuteDelete` bypass `SaveChanges` interceptors** — no audit stamps, and
  `ExecuteDelete` hard-deletes even soft-deletable rows. Set audit columns explicitly in the
  `SetProperty` calls and use `ExecuteUpdate(... DeletedAt ...)` instead of `ExecuteDelete` for
  soft-deletable tables.
- **Override both sync and async methods.** EF calls only one of them depending on how
  `SaveChanges` was invoked.
- **`eventData.Context` can be `null`** — always check.
- **Never call `SaveChanges` inside a `SavingChanges` hook** — it recurses.
- **Command interceptors run for every command**, including migrations — keep them cheap and
  match on tags, not on fragile SQL text.
- **Integration-test interceptors** (`dotnet-integration-testing`): they only run against a real
  provider, so unit tests with substituted repositories won't exercise them.
