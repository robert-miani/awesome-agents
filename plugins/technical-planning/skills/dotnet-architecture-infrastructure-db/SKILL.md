---
name: dotnet-architecture-infrastructure-db
description: >
  Repository pattern, Unit of Work, and data access conventions for Infrastructure.Db layer.
  Use this skill when implementing repositories, adding new aggregate persistence,
  creating repository interfaces in Application.Contracts, or working with UnitOfWork.
  Trigger on phrases like "repository", "unit of work", "IUnitOfWork", "GetByIdAsync",
  "GetByIdSafeAsync", "DbSet", "persistence", "save changes", "data access layer".
---

# Infrastructure.Db — Repository & Unit of Work Patterns

Conventions for implementing data access in the Infrastructure.Db layer. All repositories follow
these patterns consistently. No exceptions.

---

## Scope Boundary

**Infrastructure.Db is ONLY for database-related code.** Nothing else belongs here.

| Belongs in Infrastructure.Db | Does NOT belong in Infrastructure.Db |
|---|---|
| DbContext | JWT token generation |
| Entity configurations (Fluent API) | Password hashing |
| Repository implementations | HTTP clients |
| UnitOfWork | Email/notification services |
| Migrations | File storage |
| Database options (connection string) | Caching services |
| Database seeders | Any non-database infrastructure |

Services like JWT, password hashing, email, or external API clients belong in **separate infrastructure projects** or in a general `Infrastructure` project. See `dotnet-architecture` skill for full layer placement rules.

---

## Core Rules

1. **Never call `SaveChangesAsync` in a repository.** That is the Unit of Work's responsibility.
2. **Repositories inject `DbContext` and resolve `DbSet<T>` via `dbContext.Set<T>()`.** This keeps constructor signatures consistent and avoids DbSet properties on DbContext.
3. **IUnitOfWork exposes repository properties.** Handlers access repositories through `IUnitOfWork`, not by injecting them individually.
4. **Every repository has two get-by-id methods:** `GetByIdAsync` (returns nullable) and `GetByIdSafeAsync` (throws `NotFoundException`).
5. **Repositories are `internal sealed`** — they are implementation details of Infrastructure.Db.
6. **`Add` is synchronous, not `AddAsync`.** Use `void Add(T entity)` — EF Core's `AddAsync` is only needed for value generators that require async I/O, which we don't use.

---

## DbContext — Clean Design

The `PromptLabDbContext` does NOT expose `DbSet<T>` properties. Entity configurations are
discovered automatically via `ApplyConfigurationsFromAssembly`. Repositories resolve their
`DbSet<T>` through `dbContext.Set<T>()`.

```csharp
namespace PromptLab.Infrastructure.Db;

using Microsoft.EntityFrameworkCore;

public sealed class PromptLabDbContext : DbContext
{
    public PromptLabDbContext(DbContextOptions<PromptLabDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PromptLabDbContext).Assembly);
    }
}
```

**Do NOT add DbSet properties:**
```csharp
// ❌ WRONG — do not add DbSet properties to DbContext
public DbSet<User> Users { get; set; }
public DbSet<Organization> Organizations { get; set; }
```

Repositories use `_dbContext.Set<T>()` instead — this keeps the DbContext clean and
avoids it becoming a god object that grows with every new entity.

---

## IUnitOfWork Contract

Defined in `Application.Contracts/Persistence/IUnitOfWork.cs`. Exposes all repository interfaces as properties plus the `SaveChangesAsync` method.

```csharp
namespace PromptLab.Application.Contracts.Persistence;

using System.Threading;
using System.Threading.Tasks;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IOrganizationRepository Organizations { get; }
    IProjectRepository Projects { get; }
    IPromptRepository Prompts { get; }
    // Add new repositories here as they are created

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
```

### Adding a New Repository

When adding a new aggregate, add its repository interface as a property on `IUnitOfWork`.
Handlers then access it via `_unitOfWork.Users`, `_unitOfWork.Organizations`, etc.

---

## UnitOfWork Implementation

Defined in `Infrastructure.Db/Persistence/UnitOfWork.cs`. Wraps `DbContext`, receives repositories via DI constructor injection.

```csharp
namespace PromptLab.Infrastructure.Db.Persistence;

using PromptLab.Application.Contracts.Persistence;

internal sealed class UnitOfWork : IUnitOfWork
{
    private readonly PromptLabDbContext _dbContext;

    public UnitOfWork(
        PromptLabDbContext dbContext,
        IUserRepository users,
        IOrganizationRepository organizations)
    {
        _dbContext = dbContext;
        Users = users;
        Organizations = organizations;
    }

    public IUserRepository Users { get; }
    public IOrganizationRepository Organizations { get; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
```

---

## Repository Interface Convention

Defined in `Application.Contracts/Persistence/I{Entity}Repository.cs`.

Every repository interface MUST include:

```csharp
namespace PromptLab.Application.Contracts.Persistence;

public interface IUserRepository
{
    /// <summary>
    /// Returns the entity or null if not found.
    /// </summary>
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the entity or throws NotFoundException.
    /// Use in command handlers where the entity MUST exist.
    /// </summary>
    Task<User> GetByIdSafeAsync(Guid id, CancellationToken cancellationToken = default);

    void Add(User user);

    // Add entity-specific query methods below (GetByEmailAsync, etc.)
}
```

### When to Use Which

| Method | Use When | Returns |
|--------|----------|---------|
| `GetByIdAsync` | Caller handles null (e.g., checking existence) | `T?` |
| `GetByIdSafeAsync` | Entity must exist or it's an error (e.g., command handlers) | `T` (throws `NotFoundException`) |

---

## Repository Implementation Convention

Defined in `Infrastructure.Db/Persistence/{Entity}Repository.cs`.

**Key rules:**
- Constructor takes `PromptLabDbContext`, resolves `DbSet<T>` via `dbContext.Set<T>()`
- Class is `internal sealed`
- Never calls `SaveChangesAsync` — that is `IUnitOfWork`'s job
- `GetByIdSafeAsync` throws `NotFoundException` with a descriptive message
- `Add` is `void` (synchronous) — EF Core tracks the entity in memory

```csharp
namespace PromptLab.Infrastructure.Db.Persistence;

using Microsoft.EntityFrameworkCore;
using PromptLab.Application.Contracts.Persistence;
using PromptLab.Domain.Exceptions;
using PromptLab.Domain.Identity;

internal sealed class UserRepository : IUserRepository
{
    private readonly DbSet<User> _users;

    public UserRepository(PromptLabDbContext dbContext)
    {
        _users = dbContext.Set<User>();
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<User> GetByIdSafeAsync(Guid id, CancellationToken cancellationToken = default)
    {
        User? user = await _users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        if (user is null)
        {
            throw new NotFoundException($"User with id '{id}' was not found.");
        }

        return user;
    }

    public void Add(User user)
    {
        _users.Add(user);
    }

    // Entity-specific methods below
    public async Task<User?> GetByEmailAsync(Email email, CancellationToken cancellationToken = default)
    {
        return await _users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
}
```

---

## Handler Usage Pattern

Handlers inject `IUnitOfWork` — NOT individual repositories. This provides a single entry point for all persistence and ensures `SaveChangesAsync` is called exactly once per operation.

```csharp
public sealed class CreateOrganizationCommandHandler
    : IRequestHandler<CreateOrganizationCommand, CreateOrganizationResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrganizationCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateOrganizationResponse> Handle(
        CreateOrganizationCommand request,
        CancellationToken cancellationToken)
    {
        // Use repositories through UnitOfWork
        User user = await _unitOfWork.Users.GetByIdSafeAsync(request.UserId, cancellationToken);

        Organization organization = Organization.Create(request.Name, user.Id);

        _unitOfWork.Organizations.Add(organization);

        // SaveChanges called exactly once
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateOrganizationResponse(organization.Id);
    }
}
```

---

## DI Registration

Repositories ARE registered individually in DI. UnitOfWork receives them via constructor injection.

```csharp
// Infrastructure.Db/Module.cs
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IOrganizationRepository, OrganizationRepository>();
services.AddScoped<IUnitOfWork, UnitOfWork>();
```

Register repositories BEFORE `IUnitOfWork` so they are available for injection.

---

## Checklist — Adding a New Repository

When adding persistence for a new aggregate:

1. **Create interface** in `Application.Contracts/Persistence/I{Entity}Repository.cs`
   - [ ] Includes `GetByIdAsync` (returns nullable)
   - [ ] Includes `GetByIdSafeAsync` (throws NotFoundException)
   - [ ] Includes `void Add(T entity)` (synchronous)
   - [ ] Entity-specific query methods as needed

2. **Create implementation** in `Infrastructure.Db/Persistence/{Entity}Repository.cs`
   - [ ] Constructor takes `PromptLabDbContext`, resolves `DbSet<T>` via `dbContext.Set<T>()`
   - [ ] Class is `internal sealed`
   - [ ] `GetByIdSafeAsync` throws `NotFoundException` with descriptive message
   - [ ] `Add` is `void` (synchronous)
   - [ ] Never calls `SaveChangesAsync`

3. **Update IUnitOfWork** in `Application.Contracts/Persistence/IUnitOfWork.cs`
   - [ ] Add `I{Entity}Repository {Entities} { get; }` property

4. **Update UnitOfWork** in `Infrastructure.Db/Persistence/UnitOfWork.cs`
   - [ ] Add constructor parameter for the new repository
   - [ ] Expose as public get-only property

5. **Register in DI** in `Infrastructure.Db/Module.cs`
   - [ ] `services.AddScoped<I{Entity}Repository, {Entity}Repository>();`
   - [ ] Ensure it's registered BEFORE `IUnitOfWork`

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Correct Approach |
|---|---|---|
| Calling `SaveChangesAsync` in repository | Multiple saves in one operation breaks atomicity | Call `SaveChangesAsync` only through `IUnitOfWork` |
| Adding `DbSet<T>` properties to DbContext | DbContext becomes a god object, grows with every entity | Use `dbContext.Set<T>()` in repositories |
| Using `AddAsync` instead of `Add` | `AddAsync` is only for value generators needing async I/O | Use synchronous `void Add(T entity)` |
| Injecting repositories directly into handlers | Bypasses UnitOfWork, no single save point | Inject `IUnitOfWork`, access repos via properties |
| Only `GetByIdAsync` without safe variant | Handlers repeat null-check + throw boilerplate | Always provide both `GetByIdAsync` and `GetByIdSafeAsync` |
