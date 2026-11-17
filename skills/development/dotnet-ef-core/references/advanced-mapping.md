# EF Core — Advanced Mapping

Read this when the model goes beyond plain entities, owned types and one-to-many relationships.
All examples are `IEntityTypeConfiguration<T>` classes (or `ConfigureConventions` /
`OnModelCreating` where noted) and follow `dotnet-code-style`. Minimum EF Core version is given
per feature — check the solution's EF Core major version before using one.

---

## Inheritance Strategies

| Strategy | Tables | Pick when | EF Core |
|----------|--------|-----------|---------|
| **TPH** — table per hierarchy (default) | One table + discriminator column | Subtypes differ by few columns; you query across the hierarchy often. Fastest. | all |
| **TPT** — table per type | Base table + one table per subtype, joined | Subtype columns must be non-nullable / normalized; rarely queried polymorphically | 5+ |
| **TPC** — table per concrete type | One full table per concrete type, no joins | You mostly query one concrete type; base type is abstract | 7+ |

```csharp
// TPH — configure on the base type
internal sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");

        builder.HasDiscriminator<string>("payment_type")
            .HasValue<CardPayment>("card")
            .HasValue<BankTransferPayment>("bank_transfer");

        builder.Property("payment_type").HasMaxLength(30);
    }
}

// TPT — one line on the base type; each subtype maps to its own table
builder.UseTptMappingStrategy();

// TPC — base type should be abstract; keys must be unique across all tables
builder.UseTpcMappingStrategy();
```

**TPC gotcha:** identity / auto-increment keys collide across tables. Use `Guid` keys or a shared
database sequence (see *Sequences* below).

---

## Table Splitting and Entity Splitting

**Table splitting** — two entities, one table. Use it to load a large, rarely needed part of a
row (e.g. a document body) only when asked for.

```csharp
internal sealed class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.ToTable("articles");
        builder.HasKey(a => a.Id);

        builder.HasOne(a => a.Content)
            .WithOne()
            .HasForeignKey<ArticleContent>(c => c.Id);
    }
}

internal sealed class ArticleContentConfiguration : IEntityTypeConfiguration<ArticleContent>
{
    public void Configure(EntityTypeBuilder<ArticleContent> builder)
    {
        builder.ToTable("articles");          // same table as Article
        builder.HasKey(c => c.Id);
    }
}
```

**Entity splitting** (EF Core 7+) — one entity, several tables:

```csharp
builder.ToTable("customers");
builder.SplitToTable("customer_contacts", table =>
{
    table.Property(c => c.Phone);
    table.Property(c => c.AlternativeEmail);
});
```

---

## Owned Types vs Complex Types

| | Owned type (`OwnsOne` / `OwnsMany`) | Complex type (`ComplexProperty`, EF Core 8+) |
|---|---|---|
| Identity | Has a hidden key; tracked as an entity | Pure value — no key, compared by value |
| Sharing an instance between two owners | Not allowed | Allowed |
| Collections | `OwnsMany` (separate table or JSON) | Not supported in EF Core 8/9 |
| Nullable | Supported | Must be required in EF Core 8/9 |

Prefer **complex types** for small immutable value objects (`Money`, `Address`) on EF Core 8+;
use **owned types** when you need collections or optional values on older versions.

```csharp
builder.ComplexProperty(o => o.Total, money =>
{
    money.Property(m => m.Amount).HasColumnName("total_amount").HasPrecision(18, 2);
    money.Property(m => m.Currency).HasColumnName("total_currency").HasMaxLength(3);
});
```

---

## JSON Columns

Store an aggregate's nested data as one JSON column instead of extra tables (EF Core 7+; supported
by SQL Server and Npgsql). EF translates LINQ over the JSON properties to SQL.

```csharp
builder.OwnsOne(o => o.Metadata, metadata =>
{
    metadata.ToJson();
    metadata.OwnsMany(m => m.Tags);
});
```

**Primitive collections** (EF Core 8+): `List<string>`, `int[]`, `List<Guid>` properties are mapped
to a JSON column automatically — no configuration needed, and they can be queried with LINQ
(`o.Tags.Contains("vip")`).

Use JSON when the nested data is always loaded with its owner and rarely filtered on. If you
filter or join on it often, model it as columns or a child table and index it.

---

## Keyless Entities (views, reports, raw SQL results)

```csharp
internal sealed class OrderStatsConfiguration : IEntityTypeConfiguration<OrderStats>
{
    public void Configure(EntityTypeBuilder<OrderStats> builder)
    {
        builder.HasNoKey();
        builder.ToView("order_stats");          // read-only; never tracked
    }
}
```

For ad-hoc results you don't want in the model, use `db.Database.SqlQuery<T>($"...")` (EF Core 8+
supports unmapped types) — keep it parameterised via interpolation.

---

## Value Converters and Strongly-Typed IDs

```csharp
// Per property
builder.Property(o => o.Id)
    .HasConversion(id => id.Value, value => new OrderId(value));

// For every property of a type — in AppDbContext
protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
{
    configurationBuilder.Properties<OrderId>()
        .HaveConversion<OrderIdConverter>();

    configurationBuilder.Properties<decimal>()
        .HavePrecision(18, 2);
}

internal sealed class OrderIdConverter : ValueConverter<OrderId, Guid>
{
    public OrderIdConverter()
        : base(id => id.Value, value => new OrderId(value))
    {
    }
}
```

Converted properties can't always be translated in LINQ (e.g. calling methods on the converted
type). Compare whole values (`o.Id == orderId`) rather than members (`o.Id.Value == guid`).

---

## Backing Fields and Encapsulated Collections

Keep collections read-only on the entity and let EF write the private field:

```csharp
public sealed class Order
{
    private readonly List<OrderItem> _items = new List<OrderItem>();

    public IReadOnlyCollection<OrderItem> Items => _items;
}

// Configuration
builder.Navigation(o => o.Items)
    .UsePropertyAccessMode(PropertyAccessMode.Field);
```

EF Core discovers `_items` by convention; the explicit access mode makes sure it never calls a
setter.

---

## Sequences and HiLo

```csharp
// In OnModelCreating
modelBuilder.HasSequence<long>("order_numbers").StartsAt(1000).IncrementsBy(1);

// PostgreSQL
builder.Property(o => o.Number).HasDefaultValueSql("nextval('order_numbers')");

// SQL Server
builder.Property(o => o.Number).HasDefaultValueSql("NEXT VALUE FOR order_numbers");
```

`builder.Property(o => o.Id).UseHiLo("order_hilo")` (SQL Server and Npgsql) lets EF assign
integer keys client-side in batches from a sequence — useful for TPC or bulk inserts with
integer keys.

---

## Temporal Tables (SQL Server)

```csharp
builder.ToTable("orders", table => table.IsTemporal());

// Query history
List<Order> asOf = await db.Orders
    .TemporalAsOf(pointInTime)
    .Where(o => o.Id == id)
    .ToListAsync(ct);
```

PostgreSQL has no built-in equivalent — use an audit table filled by an interceptor
(`references/interceptors.md`) or a trigger.

---

## Gotchas

- **Query filters and required navigations:** a global filter (e.g. soft delete) on a principal
  hides it, so a required navigation from a dependent can come back `null`. Make such
  navigations optional or apply the same filter to both sides.
- **Changing an inheritance strategy or splitting a table later is a data migration**, not a
  config tweak — review the generated migration and write the data-copy SQL yourself.
- **JSON and complex-type support differs per provider and EF Core version** — check the
  provider's docs (Npgsql, SQL Server) for the exact version before relying on querying inside
  JSON.
