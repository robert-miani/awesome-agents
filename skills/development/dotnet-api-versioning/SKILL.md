---
name: dotnet-api-versioning
description: >
  API versioning patterns for .NET 9/10 using Asp.Versioning.Mvc.
  Use this skill when the user asks about API versioning, URL versioning,
  controller organization by version, or multi-version API support.
  Trigger on phrases like "API versioning", "version endpoint", "v1", "v2",
  "multiple API versions", "version controller", or any question about
  organizing controllers by version.
---

# API Versioning Skill (.NET 9/10)

This skill covers API versioning using `Asp.Versioning.Mvc` with URL segment versioning (`/api/v1/...`).

**PREREQUISITES:** Load these skills first:
- `dotnet-architecture` — for layer structure
- `dotnet-code-style` — for code conventions

---

## Folder Structure

Controllers are organized by **feature** then **version**:

```
src/Presentation/ProjectName.Presentation.Api/
├── Controllers/
│   ├── Health/
│   │   └── v1/
│   │       └── HealthController.cs
│   ├── Orders/
│   │   └── v1/
│   │       └── OrdersController.cs
│   └── Products/
│       ├── v1/
│       │   └── ProductsController.cs
│       └── v2/
│           └── ProductsController.cs
├── Module.cs
├── Routing/
│   └── SlugifyParameterTransformer.cs
└── ProjectName.Presentation.Api.csproj
```

**Rules:**
- Each feature has its own folder under `Controllers/`
- Each version has a subfolder (`v1/`, `v2/`, etc.)
- Controller class names are the same across versions (namespace differentiates)
- Namespace follows folder structure: `ProjectName.Presentation.Api.Controllers.Orders.v1`

---

## NuGet Package

Add to `Directory.Packages.props`:

```xml
<ItemGroup Label="API">
  <PackageVersion Include="Asp.Versioning.Mvc" Version="8.1.0" />
  <PackageVersion Include="Asp.Versioning.Mvc.ApiExplorer" Version="8.1.0" />
  <!-- existing packages... -->
</ItemGroup>
```

Add to `Presentation.Api.csproj`:

```xml
<PackageReference Include="Asp.Versioning.Mvc" />
<PackageReference Include="Asp.Versioning.Mvc.ApiExplorer" />
```

---

## Configuration

### Presentation.Api/Routing/SlugifyParameterTransformer.cs

```csharp
// src/Presentation/ProjectName.Presentation.Api/Routing/SlugifyParameterTransformer.cs
namespace ProjectName.Presentation.Api.Routing;

using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Routing;

/// <summary>
/// Transforms PascalCase controller/action names to kebab-case URLs.
/// Example: OrderItems → order-items
/// </summary>
internal sealed partial class SlugifyParameterTransformer : IOutboundParameterTransformer
{
    private const string SlugifyRegexPattern = "([a-z])([A-Z])";
    private const string SlugifyRegexReplacement = "$1-$2";

    public string? TransformOutbound(object? value)
    {
        string? valueString = value?.ToString();

        return !string.IsNullOrWhiteSpace(valueString)
            ? SlugifyRegex().Replace(valueString, SlugifyRegexReplacement).ToLower(CultureInfo.InvariantCulture)
            : null;
    }

    [GeneratedRegex(SlugifyRegexPattern)]
    private static partial Regex SlugifyRegex();
}
```

### Presentation.Api/Module.cs

```csharp
// src/Presentation/ProjectName.Presentation.Api/Module.cs
namespace ProjectName.Presentation.Api;

using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Presentation.Api.Routing;

public static class Module
{
    public static IServiceCollection AddApi(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddControllers(options =>
            {
                // Transform PascalCase to kebab-case in URLs
                options.Conventions.Add(
                    new RouteTokenTransformerConvention(
                        new SlugifyParameterTransformer()));
            })
            .AddApplicationPart(typeof(Module).Assembly);

        services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
            })
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

        services.AddRouting(options => options.LowercaseUrls = true);

        return services;
    }
}
```

### URL Transformation Examples

| Controller | Without Slugify | With Slugify |
|------------|-----------------|---------------|
| `OrderItemsController` | `/api/v1/OrderItems` | `/api/v1/order-items` |
| `UserProfileController` | `/api/v1/UserProfile` | `/api/v1/user-profile` |
| `HealthController` | `/api/v1/Health` | `/api/v1/health` |

### Configuration Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `DefaultApiVersion` | `new ApiVersion(1, 0)` | Default when no version specified |
| `AssumeDefaultVersionWhenUnspecified` | `true` | Allows `/api/health` → `/api/v1/health` |
| `ReportApiVersions` | `true` | Adds `api-supported-versions` response header |
| `ApiVersionReader` | `UrlSegmentApiVersionReader` | Reads version from URL path (`/api/v1/...`) |
| `GroupNameFormat` | `'v'VVV` | OpenAPI grouping format (v1, v2, etc.) |
| `SubstituteApiVersionInUrl` | `true` | Replaces `{version}` placeholder in routes |

---

## Controller Template

### Standard Versioned Controller

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

### Key Attributes

| Attribute | Purpose |
|-----------|---------|
| `[ApiVersion("1.0")]` | Declares the API version this controller handles |
| `[Route("api/v{version:apiVersion}/[controller]")]` | URL pattern with version placeholder |

---

## Adding a New Version

When you need to create v2 of an existing controller:

### 1. Create v2 Folder and Controller

```csharp
// src/Presentation/ProjectName.Presentation.Api/Controllers/Orders/v2/OrdersController.cs
namespace ProjectName.Presentation.Api.Controllers.Orders.v2;

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
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class OrdersController : ControllerBase
{
    private readonly ISender _sender;

    public OrdersController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Creates a new order (v2 - extended response).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrder.Command command,
        CancellationToken ct)
    {
        Guid id = await _sender.Send(command, ct);
        OrderDto? order = await _sender.Send(new GetOrderById.Query(id), ct);
        return CreatedAtAction(nameof(GetById), new { id }, order);
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

### 2. (Optional) Deprecate v1

Add `[ApiVersion("1.0", Deprecated = true)]` to mark v1 as deprecated:

```csharp
[ApiController]
[ApiVersion("1.0", Deprecated = true)]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class OrdersController : ControllerBase
```

This adds `api-deprecated-versions: 1.0` header to responses.

---

## Sharing Code Between Versions

### Option 1: Share Application Layer (Recommended)

Both v1 and v2 controllers call the same Application commands/queries. Version differences are handled in the controller layer only.

### Option 2: Version-Specific DTOs

If DTOs change between versions, create versioned DTOs in Application.Contracts:

```
Application.Contracts/
├── Dtos/
│   ├── OrderDto.cs           # Shared DTO
│   └── v2/
│       └── OrderDetailDto.cs # v2-specific DTO
```

### Option 3: Version-Specific Commands/Queries

For breaking changes in business logic, create versioned commands:

```
Application/
├── Orders/
│   ├── CreateOrder.cs           # v1 command
│   └── v2/
│       └── CreateOrderV2.cs     # v2 command with different behavior
```

---

## OpenAPI Configuration

### Multiple OpenAPI Documents Per Version

```csharp
// src/ProjectName.Startup/Program.cs
using Asp.Versioning.ApiExplorer;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// ... service registrations ...

// OpenAPI per version
IApiVersionDescriptionProvider versionProvider = 
    builder.Services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();

foreach (ApiVersionDescription description in versionProvider.ApiVersionDescriptions)
{
    builder.Services.AddOpenApi(description.GroupName, options =>
    {
        options.AddDocumentTransformer((document, context, ct) =>
        {
            document.Info.Title = "ProjectName API";
            document.Info.Version = description.ApiVersion.ToString();
            return Task.CompletedTask;
        });
    });
}

WebApplication app = builder.Build();

// Map OpenAPI endpoints per version
foreach (ApiVersionDescription description in versionProvider.ApiVersionDescriptions)
{
    app.MapOpenApi($"/openapi/{description.GroupName}.json");
}

app.MapScalarApiReference();
app.MapControllers();

app.Run();
```

---

## Health Controller (Starter)

```csharp
// src/Presentation/ProjectName.Presentation.Api/Controllers/Health/v1/HealthController.cs
namespace ProjectName.Presentation.Api.Controllers.Health.v1;

using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Health;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class HealthController : ControllerBase
{
    private readonly ISender _sender;

    public HealthController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Returns the health status of the API.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(GetHealth.Response), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        GetHealth.Response result = await _sender.Send(new GetHealth.Query(), ct);
        return Ok(result);
    }
}
```

---

## URL Examples

| Version | Endpoint | URL |
|---------|----------|-----|
| v1 | Get Health | `GET /api/v1/health` |
| v1 | Create Order | `POST /api/v1/orders` |
| v1 | Get Order | `GET /api/v1/orders/{id}` |
| v2 | Create Order | `POST /api/v2/orders` |
| v2 | Get Order | `GET /api/v2/orders/{id}` |

---

## Checklist

When adding API versioning to a project:

- [ ] Add `Asp.Versioning.Mvc` and `Asp.Versioning.Mvc.ApiExplorer` to `Directory.Packages.props`
- [ ] Add package references to `Presentation.Api.csproj`
- [ ] Configure versioning in `Module.cs`
- [ ] Reorganize controllers: `Controllers/[Feature]/v1/`
- [ ] Update namespace to match folder structure
- [ ] Add `[ApiVersion("1.0")]` attribute to controllers
- [ ] Update route to `api/v{version:apiVersion}/[controller]`
- [ ] Update OpenAPI configuration for versioned docs (optional)

---

## Migration from Non-Versioned API

If converting an existing non-versioned API:

1. Add versioning packages and configuration
2. Move controllers: `Controllers/HealthController.cs` → `Controllers/Health/v1/HealthController.cs`
3. Update namespaces to match new paths
4. Add `[ApiVersion("1.0")]` and update `[Route]`
5. Keep `AssumeDefaultVersionWhenUnspecified = true` for backwards compatibility
6. Old URLs (`/api/health`) continue to work, mapped to v1
