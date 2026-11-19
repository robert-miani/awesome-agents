# Scaffold — Example "Item" Feature

The mandatory example vertical slice generated after the starter files (MediatR style; for **services** style use `dotnet-feature` → `references/application-services.md` with `Order` renamed to `Item`). Part of the `dotnet-scaffold` skill.

## Example Feature Implementation (MANDATORY)

**ALWAYS scaffold an example "Item" feature demonstrating the full vertical slice pattern.**

This includes:
- Domain entity
- Repository interface + implementation
- Unit of Work interface + implementation
- Entity configuration
- Command (CreateItem) with validator
- Query (GetItemById)
- Controller

### Domain/Items/Item.cs

```csharp
// src/Domain/ProjectName.Domain/Items/Item.cs
using System;

namespace ProjectName.Domain.Items;

public sealed class Item
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public decimal Price { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UpdatedAt { get; private set; }

    private Item()
    {
        // EF Core constructor
    }

    public Item(string name, string? description, decimal price)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Price = price;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void Update(string name, string? description, decimal price)
    {
        Name = name;
        Description = description;
        Price = price;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
```

### Application.Contracts/Persistence/IUnitOfWork.cs

```csharp
// src/Application/ProjectName.Application.Contracts/Persistence/IUnitOfWork.cs
using System.Threading;
using System.Threading.Tasks;

namespace ProjectName.Application.Contracts.Persistence;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
```

### Application.Contracts/Persistence/IItemRepository.cs

```csharp
// src/Application/ProjectName.Application.Contracts/Persistence/IItemRepository.cs
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ProjectName.Domain.Items;

namespace ProjectName.Application.Contracts.Persistence;

public interface IItemRepository
{
    Task<Item?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Item>> GetAllAsync(CancellationToken cancellationToken = default);

    void Add(Item item);

    void Update(Item item);

    void Delete(Item item);
}
```

### Application/Items/CreateItem.cs

```csharp
// src/Application/ProjectName.Application/Items/CreateItem.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Items;

namespace ProjectName.Application.Items;

public static class CreateItem
{
    public sealed record Command(
        string Name,
        string? Description,
        decimal Price) : IRequest<Response>;

    public sealed record Response(Guid Id);

    internal sealed class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(1000);

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0);
        }
    }

    internal sealed class Handler : IRequestHandler<Command, Response>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IUnitOfWork _unitOfWork;

        public Handler(IItemRepository itemRepository, IUnitOfWork unitOfWork)
        {
            _itemRepository = itemRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
        {
            Item item = new(request.Name, request.Description, request.Price);

            _itemRepository.Add(item);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new Response(item.Id);
        }
    }
}
```

### Application/Items/GetItemById.cs

```csharp
// src/Application/ProjectName.Application/Items/GetItemById.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Items;

namespace ProjectName.Application.Items;

public static class GetItemById
{
    public sealed record Query(Guid Id) : IRequest<Response?>;

    public sealed record Response(
        Guid Id,
        string Name,
        string? Description,
        decimal Price,
        DateTimeOffset CreatedAt,
        DateTimeOffset? UpdatedAt);

    internal sealed class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();
        }
    }

    internal sealed class Handler : IRequestHandler<Query, Response?>
    {
        private readonly IItemRepository _itemRepository;

        public Handler(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        public async Task<Response?> Handle(Query request, CancellationToken cancellationToken)
        {
            Item? item = await _itemRepository.GetByIdAsync(request.Id, cancellationToken);

            if (item is null)
            {
                return null;
            }

            return new Response(
                item.Id,
                item.Name,
                item.Description,
                item.Price,
                item.CreatedAt,
                item.UpdatedAt);
        }
    }
}
```

### Infrastructure.Db/Persistence/UnitOfWork.cs

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Persistence/UnitOfWork.cs
using System.Threading;
using System.Threading.Tasks;
using ProjectName.Application.Contracts.Persistence;

namespace ProjectName.Infrastructure.Db.Persistence;

internal sealed class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _dbContext;

    public UnitOfWork(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
```

### Infrastructure.Db/Persistence/ItemRepository.cs

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Persistence/ItemRepository.cs
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Items;

namespace ProjectName.Infrastructure.Db.Persistence;

internal sealed class ItemRepository : IItemRepository
{
    private readonly AppDbContext _dbContext;

    public ItemRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Item?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Items
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Item>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Items
            .ToListAsync(cancellationToken);
    }

    public void Add(Item item)
    {
        _dbContext.Items.Add(item);
    }

    public void Update(Item item)
    {
        _dbContext.Items.Update(item);
    }

    public void Delete(Item item)
    {
        _dbContext.Items.Remove(item);
    }
}
```

### Infrastructure.Db/Configurations/ItemConfiguration.cs

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Configurations/ItemConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjectName.Domain.Items;

namespace ProjectName.Infrastructure.Db.Configurations;

internal sealed class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.ToTable("items");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.Price)
            .HasPrecision(18, 2);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt);
    }
}
```
```

### Infrastructure.Db/AppDbContext.cs (Updated)

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ProjectName.Domain.Items;

namespace ProjectName.Infrastructure.Db;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Infrastructure.Db/Module.cs (Updated with Repository Registration)

Update the Module to register the repository and unit of work:

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Module.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Infrastructure.Db.Options;
using ProjectName.Infrastructure.Db.Persistence;

namespace ProjectName.Infrastructure.Db;

public static class Module
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddOptions<DatabaseOptions>()
            .BindConfiguration(DatabaseOptions.Section)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        DatabaseOptions dbOptions = configuration
            .GetRequiredSection(DatabaseOptions.Section)
            .Get<DatabaseOptions>()!;

        // For SQL Server:
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(dbOptions.ConnectionString));

        // For PostgreSQL (use this instead):
        // services.AddDbContext<AppDbContext>(options =>
        //     options.UseNpgsql(dbOptions.ConnectionString)
        //         .UseSnakeCaseNamingConvention());

        // Repositories
        services.AddScoped<IItemRepository, ItemRepository>();

        // Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
```

### Presentation.Api/Controllers/Items/v1/ItemsController.cs

```csharp
// src/Presentation/ProjectName.Presentation.Api/Controllers/Items/v1/ItemsController.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Items;

namespace ProjectName.Presentation.Api.Controllers.Items.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class ItemsController : ControllerBase
{
    private readonly ISender _sender;

    public ItemsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Creates a new item.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateItem.Response), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateItem.Command command,
        CancellationToken ct)
    {
        CreateItem.Response result = await _sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Gets an item by its ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(GetItemById.Response), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        GetItemById.Response? result = await _sender.Send(new GetItemById.Query(id), ct);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
```

---

