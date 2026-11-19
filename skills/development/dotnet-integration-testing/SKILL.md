---
name: dotnet-integration-testing
description: >
  Writes integration tests for ASP.NET Core .NET 9/10 APIs that run the real application in memory
  with WebApplicationFactory and a real database in Docker via Testcontainers (PostgreSQL or SQL
  Server), resetting data between tests with Respawn. Covers endpoint round-trips, EF Core queries
  and migrations, validation and ProblemDetails responses, authentication with a test scheme, and
  replacing external HTTP clients. Use when the user asks for "integration tests", "API tests",
  "endpoint tests", "test against a real database", "WebApplicationFactory", "Testcontainers",
  "Respawn", "test the controller end to end", or wants to verify EF Core queries, migrations or
  DI wiring. For isolated logic tests use dotnet-unit-testing.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Integration Testing Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

You test the application the way clients use it: real HTTP requests through the real middleware pipeline, real DI container, real EF Core against the **same database engine as production** running in a throwaway Docker container. Only true externals (third-party HTTP APIs, message brokers, clocks) are replaced.

**RELATED SKILLS:** `dotnet-unit-testing` (shared conventions, test stack detection), `dotnet-architecture-presentation-rest` (routes, auth), `dotnet-error-handling` (ProblemDetails shape), `dotnet-ef-core`, `dotnet-code-style`.

---

## Step 0 — Detect Before Adding

Same rule as `dotnet-unit-testing`: reuse the solution's existing test framework, assertion library and any existing integration-test fixture (`WebApplicationFactory` subclass, `*Fixture`, `Testcontainers` usage). Extend it rather than creating a parallel one. Also read:

- **Database provider** — `UseNpgsql` vs `UseSqlServer` in `Infrastructure.Db/Module.cs` → pick the matching container.
- **Connection-string key** — the options section the Db module binds (`Database:ConnectionString` in `dotnet-scaffold` solutions; `ConnectionStrings:<Name>` in many others).
- **Auth** — whether controllers require `[Authorize]` and which scheme(s) the app registers.
- **External clients** — interfaces in `Application.Contracts` implemented by `Infrastructure.Http`.

**Docker is required** to run these tests locally and in CI (GitHub-hosted Ubuntu runners have it).

---

## Project Setup

```
tests/ProjectName.IntegrationTests/
  Infrastructure/
    ApiFactory.cs              # WebApplicationFactory + container + Respawn
    ApiCollection.cs           # xUnit collection fixture definition
    ApiTestBase.cs             # Resets the database before each test
    TestAuthHandler.cs         # (if the API requires auth)
  Orders/
    OrdersEndpointsTests.cs    # Mirrors Presentation.Api/Controllers/Orders
```

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>          <!-- xUnit v3 -->
    <IsPackable>false</IsPackable>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" />
    <PackageReference Include="xunit.v3" />
    <PackageReference Include="xunit.runner.visualstudio" />
    <PackageReference Include="Shouldly" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" />
    <PackageReference Include="Testcontainers.PostgreSql" />   <!-- or Testcontainers.MsSql -->
    <PackageReference Include="Respawn" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\src\ProjectName.Startup\ProjectName.Startup.csproj" />
  </ItemGroup>

</Project>
```

- Versions go in `Directory.Packages.props`. `Microsoft.AspNetCore.Mvc.Testing` **must match the app's ASP.NET Core major version** (9.x for `net9.0`, 10.x for `net10.0`); the other packages use their current stable versions (`dotnet package search <name> --exact-match`).
- `WebApplicationFactory<Program>` needs `Program` to be visible. Add this as the last line of `src/ProjectName.Startup/Program.cs` (a redundant `partial` declaration is harmless if the SDK already generates one):

```csharp
public partial class Program
{
}
```

---

## Fixture: ApiFactory (PostgreSQL)

One container per test run, shared through an xUnit collection fixture; the schema is created with the app's own EF migrations.

```csharp
using System.Data.Common;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using ProjectName.Infrastructure.Db;
using Respawn;
using Respawn.Graph;
using Testcontainers.PostgreSql;
using Xunit;

namespace ProjectName.IntegrationTests.Infrastructure;

public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _database = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")      // same major version as production
        .Build();

    private DbConnection _connection = null!;
    private Respawner _respawner = null!;

    public async ValueTask InitializeAsync()
    {
        await _database.StartAsync();

        using (IServiceScope scope = Services.CreateScope())
        {
            AppDbContext db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();
        }

        _connection = new NpgsqlConnection(_database.GetConnectionString());
        await _connection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_connection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = ["public"],
            TablesToIgnore = [new Table("__EFMigrationsHistory")],
        });
    }

    public Task ResetDatabaseAsync()
    {
        return _respawner.ResetAsync(_connection);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Database:ConnectionString", _database.GetConnectionString());

        builder.ConfigureTestServices(services =>
        {
            // Replace true externals here (see "External HTTP clients" and "Authentication").
        });
    }

    public override async ValueTask DisposeAsync()
    {
        await _connection.DisposeAsync();
        await _database.DisposeAsync();
        await base.DisposeAsync();
    }
}
```

**SQL Server:** use `MsSqlContainer` / `MsSqlBuilder` (`Testcontainers.MsSql`, image `mcr.microsoft.com/mssql/server:2022-latest`), `DbAdapter.SqlServer`, and `Respawner.CreateAsync(connectionString, options)` / `ResetAsync(connectionString)` — no open connection needed. Drop `SchemasToInclude` or set it to `["dbo"]`.

```csharp
using Xunit;

namespace ProjectName.IntegrationTests.Infrastructure;

[CollectionDefinition(Name)]
public sealed class ApiCollection : ICollectionFixture<ApiFactory>
{
    public const string Name = "Api";
}
```

```csharp
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace ProjectName.IntegrationTests.Infrastructure;

public abstract class ApiTestBase : IAsyncLifetime
{
    protected ApiTestBase(ApiFactory factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }

    protected ApiFactory Factory { get; }

    protected HttpClient Client { get; }

    public async ValueTask InitializeAsync()
    {
        await Factory.ResetDatabaseAsync();
    }

    public ValueTask DisposeAsync()
    {
        Client.Dispose();
        return ValueTask.CompletedTask;
    }
}
```

---

## Endpoint Tests

Put `[Collection(ApiCollection.Name)]` on **every** test class (don't rely on inheriting it from the base class). Tests in one collection run sequentially, which is what makes the shared database safe.

```csharp
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using ProjectName.Application.Contracts.Dtos;
using ProjectName.IntegrationTests.Infrastructure;
using Shouldly;
using Xunit;

namespace ProjectName.IntegrationTests.Orders;

[Collection(ApiCollection.Name)]
public sealed class OrdersEndpointsTests : ApiTestBase
{
    public OrdersEndpointsTests(ApiFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task Post_ValidOrder_Returns201AndOrderCanBeRead()
    {
        // Arrange
        CancellationToken ct = TestContext.Current.CancellationToken;
        Guid customerId = Guid.NewGuid();

        // Act
        HttpResponseMessage created = await Client.PostAsJsonAsync(
            "/api/v1/orders",
            new { customerId, total = 250m },
            ct);

        // Assert
        created.StatusCode.ShouldBe(HttpStatusCode.Created);
        created.Headers.Location.ShouldNotBeNull();

        OrderDto? order = await Client.GetFromJsonAsync<OrderDto>(created.Headers.Location, ct);
        order.ShouldNotBeNull();
        order.CustomerId.ShouldBe(customerId);
        order.Total.ShouldBe(250m);
    }

    [Fact]
    public async Task Post_TotalIsZero_Returns400ProblemDetails()
    {
        // Arrange
        CancellationToken ct = TestContext.Current.CancellationToken;

        // Act
        HttpResponseMessage response = await Client.PostAsJsonAsync(
            "/api/v1/orders",
            new { customerId = Guid.NewGuid(), total = 0m },
            ct);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        response.Content.Headers.ContentType.ShouldNotBeNull();
        response.Content.Headers.ContentType.MediaType.ShouldBe("application/problem+json");
    }

    [Fact]
    public async Task Get_UnknownId_Returns404()
    {
        // Act
        HttpResponseMessage response = await Client.GetAsync(
            $"/api/v1/orders/{Guid.NewGuid()}",
            TestContext.Current.CancellationToken);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
    }
}
```

**What every endpoint should have:** the happy path (status + body + persisted state), a validation failure (400 + ProblemDetails), not-found (404) where applicable, and an auth failure (401/403) for protected endpoints. To assert the validation error details, deserialize the body with the shape `dotnet-error-handling` produces in this solution rather than assuming the default `ValidationProblemDetails`.

**Seeding data:** arrange through the API when possible (it exercises the real path). For state the API can't create, seed directly:

```csharp
using (IServiceScope scope = Factory.Services.CreateScope())
{
    AppDbContext db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Orders.Add(new Order(customerId, 100m));
    await db.SaveChangesAsync(ct);
}
```

---

## Authentication

Replace the real scheme with a test scheme that always authenticates a known user:

```csharp
using System;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ProjectName.IntegrationTests.Infrastructure;

public sealed class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "Test";

    public static readonly Guid UserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (Request.Headers.ContainsKey("X-Test-Anonymous"))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, UserId.ToString()),
            new Claim(ClaimTypes.Name, "integration-test-user"),
        ];

        ClaimsPrincipal principal = new(new ClaimsIdentity(claims, SchemeName));
        AuthenticationTicket ticket = new(principal, SchemeName);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
```

Register it in `ConfigureTestServices` and make it the default for authenticate **and** challenge:

```csharp
services.AddAuthentication()
    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, options =>
    {
    });

services.PostConfigure<AuthenticationOptions>(options =>
{
    options.DefaultScheme = TestAuthHandler.SchemeName;
    options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
    options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
});
```

For 401 tests, send the `X-Test-Anonymous` header. Add role/permission claims in the handler if the API uses policies.

---

## External HTTP Clients

Never call real third-party services. Replace the `Application.Contracts` interface with a substitute owned by the factory:

```csharp
public IPaymentClient PaymentClient { get; } = Substitute.For<IPaymentClient>();

// inside ConfigureTestServices
services.RemoveAll<IPaymentClient>();
services.AddSingleton(PaymentClient);
```

(`RemoveAll` is in `Microsoft.Extensions.DependencyInjection.Extensions`; add `NSubstitute` to the project.) Call `PaymentClient.ClearReceivedCalls()` and reset its returns in `ApiTestBase.InitializeAsync` when tests configure it. To test the typed client itself (serialization, error handling, retries), use WireMock.Net in a separate test class rather than substituting it.

---

## Running

```bash
dotnet test tests/ProjectName.IntegrationTests       # Docker must be running
```

First run pulls the database image; later runs reuse it. Keep unit and integration tests in separate projects so `dotnet test tests/*.UnitTests` stays fast and Docker-free.

---

## Gotchas

- **Never use `UseInMemoryDatabase`** or swap the provider for SQLite "to make it faster" — you stop testing your SQL, constraints and migrations. The container is the point.
- **Configuration must be overridden before the host builds.** `builder.UseSetting(...)` in `ConfigureWebHost` works even when `Program.cs` reads configuration eagerly; `ConfigureAppConfiguration` may be applied too late. If an override still doesn't take, replace the registration in `ConfigureTestServices` (e.g. `services.RemoveAll<DbContextOptions<AppDbContext>>()` then `services.AddDbContext<AppDbContext>(...)` with the container's connection string).
- **Respawn needs tables to exist** when `Respawner.CreateAsync` runs — migrate first (as above), and always ignore `__EFMigrationsHistory`.
- **Startup work in `Program.cs`** (auto-migrate, seeding, hosted services polling queues) runs in tests too. Guard it with `!app.Environment.IsEnvironment("Testing")` or remove hosted services in `ConfigureTestServices`.
- **Routes include the API version** (`/api/v1/...`) and, with `SlugifyParameterTransformer`, lower-case/kebab-case controller names.
- **One `ApiFactory` per collection.** Several collections each start their own container — fine for isolation, slow if overused. Start with one.
- **Older solutions:** projects with a `Startup` class use `WebApplicationFactory<Startup>`; on xUnit v2, `IAsyncLifetime` returns `Task` and `TestContext.Current` doesn't exist. .NET Framework / OWIN apps can't use `WebApplicationFactory` — follow whatever in-memory host (e.g. `Microsoft.Owin.Testing`) the solution already uses.
