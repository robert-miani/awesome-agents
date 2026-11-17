# .NET Entity Framework Core

## Description

Expert guidance for Entity Framework Core targeting .NET 9/10. Covers DbContext setup, Fluent API entity configuration, relationships, migrations, querying best practices, performance tuning (no N+1, no-tracking reads, pagination), transactions, and compiled queries.

## When to Use

- Setting up DbContext and entity configurations
- Writing EF Core queries (eager loading, split queries, pagination)
- Creating or reviewing migrations
- Configuring entity relationships (one-to-many, many-to-many, owned types)
- Diagnosing performance issues (N+1, client-side evaluation)
- Working with value objects or owned entities

## Usage

Activate this skill when working with EF Core. Key principles:

- Fluent API over Data Annotations (keep entities clean)
- `AsNoTracking()` for all read-only queries
- Always paginate — never return unbounded result sets
- Review generated migrations before applying
- Compiled queries for hot paths

## Example

```csharp
// Entity configuration — Fluent API
public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Name).HasMaxLength(200).IsRequired();
        builder.HasMany(o => o.Items).WithOne().HasForeignKey(i => i.OrderId);
    }
}

// Query — no-tracking with pagination
List<Order> orders = await dbContext.Set<Order>()
    .AsNoTracking()
    .Where(o => o.Status == OrderStatus.Active)
    .OrderBy(o => o.CreatedAt)
    .Skip(page * pageSize)
    .Take(pageSize)
    .ToListAsync(ct);
```

## Requirements

- .NET 9 or 10 (existing projects on older targets: see `dotnet-architecture` → Target Framework & Existing Projects)
- Entity Framework Core 9+ (match the major version to the target framework)
- A supported database provider (Npgsql, SqlServer, Sqlite)
