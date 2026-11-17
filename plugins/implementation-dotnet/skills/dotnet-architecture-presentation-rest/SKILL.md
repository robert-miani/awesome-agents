---
name: dotnet-architecture-presentation-rest
description: >
  REST API presentation layer patterns for .NET 9/10. Use this skill when the user is working on
  controllers, API documentation, OpenAPI/Scalar setup, middleware pipeline, Module registration,
  or any presentation-layer concern. Trigger on phrases like "controller", "endpoint", "Scalar",
  "OpenAPI", "Swagger", "middleware", "presentation layer", "UseApi", "AddApi", "API docs",
  "authentication in Scalar", "ProducesResponseType", or any question about the Presentation.Api project.
---

# Presentation REST Skill (.NET 9/10)

This skill covers everything in the `Presentation.Api` layer: controllers, Module registration (DI + middleware), OpenAPI/Scalar configuration, API versioning, error handling, and routing conventions.

**PREREQUISITES:** Load these skills first:
- `dotnet-architecture` — for layer structure and project references
- `dotnet-code-style` — for code conventions

**RELATED SKILLS:**
- `dotnet-feature` — for full feature implementation across layers
- `dotnet-error-handling` — for domain exceptions and ProblemDetails mapping
- `dotnet-api-versioning` — for versioning patterns and controller folder structure

---

## Project Structure

```
src/Presentation/ProjectName.Presentation.Api/
├── Controllers/
│   ├── Health/
│   │   └── v1/
│   │       └── HealthController.cs
│   ├── Auth/
│   │   └── v1/
│   │       └── AuthController.cs
│   ├── Organizations/
│   │   └── v1/
│   │       └── OrganizationsController.cs
│   └── Feature/
│       └── v1/
│           └── FeatureController.cs
├── Extensions/
│   └── ClaimsPrincipalExtensions.cs
├── Routing/
│   └── SlugifyParameterTransformer.cs
├── Module.cs
└── ProjectName.Presentation.Api.csproj
```

**Rules:**
- Each feature has its own folder under `Controllers/`
- Each version has a subfolder (`v1/`, `v2/`, etc.)
- Request DTOs (records) live in the same file as the controller or as nested types
- Namespace follows folder structure exactly

---

## NuGet Packages

Add to `Directory.Packages.props`:

```xml
<ItemGroup Label="API">
  <PackageVersion Include="Asp.Versioning.Mvc" Version="8.1.0" />
  <PackageVersion Include="Asp.Versioning.Mvc.ApiExplorer" Version="8.1.0" />
  <PackageVersion Include="Hellang.Middleware.ProblemDetails" Version="6.6.0" />
  <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="9.0.4" />
  <PackageVersion Include="Scalar.AspNetCore" Version="1.2.74" />
</ItemGroup>
```

Add to `Presentation.Api.csproj`:

```xml
<ItemGroup>
  <FrameworkReference Include="Microsoft.AspNetCore.App" />
</ItemGroup>

<ItemGroup>
  <PackageReference Include="Asp.Versioning.Mvc" />
  <PackageReference Include="Asp.Versioning.Mvc.ApiExplorer" />
  <PackageReference Include="Hellang.Middleware.ProblemDetails" />
  <PackageReference Include="Microsoft.AspNetCore.OpenApi" />
  <PackageReference Include="Scalar.AspNetCore" />
</ItemGroup>
```

---

## Module Pattern

The Presentation layer exposes two extension methods:
- `AddApi()` — registers all services (controllers, versioning, routing, ProblemDetails, OpenAPI)
- `UseApi()` — configures the middleware pipeline and maps endpoints

### Module.cs Template

```csharp
namespace ProjectName.Presentation.Api;

using System;
using System.Threading.Tasks;
using Asp.Versioning;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using ProjectName.Domain.Exceptions;
using ProjectName.Presentation.Api.Routing;
using Scalar.AspNetCore;
using ValidationException = ProjectName.Domain.Exceptions.ValidationException;

public static class Module
{
    private static readonly Type[] KnownExceptionTypes =
    [
        typeof(ValidationException),
        typeof(NotFoundException),
        typeof(ConflictException),
        typeof(BusinessRuleException)
    ];

    public static IServiceCollection AddApi(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        services.AddControllers(options =>
            {
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

        services.AddProblemDetails(options => ConfigureProblemDetails(options, environment));

        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, _, _) =>
            {
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    Description = "Enter the JWT token returned by /api/v1/auth/login"
                };

                document.SecurityRequirements.Add(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        []
                    }
                });

                return Task.CompletedTask;
            });
        });

        return services;
    }

    public static WebApplication UseApi(this WebApplication app)
    {
        app.UseProblemDetails();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference(options =>
            {
                options.Authentication = new ScalarAuthenticationOptions
                {
                    PreferredSecurityScheme = "Bearer"
                };
            });
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }

    private static void ConfigureProblemDetails(
        Hellang.Middleware.ProblemDetails.ProblemDetailsOptions options,
        IHostEnvironment environment)
    {
        options.IncludeExceptionDetails = (_, exception) =>
            environment.IsDevelopment() && !Array.Exists(KnownExceptionTypes, t => t == exception.GetType());

        options.Map<ValidationException>(exception =>
            new ValidationProblemDetails(exception.Errors)
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status400BadRequest
            });

        options.Map<NotFoundException>(exception =>
            new ValidationProblemDetails(exception.Errors)
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status404NotFound
            });

        options.Map<ConflictException>(exception =>
            new ProblemDetails
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status409Conflict
            });

        options.Map<BusinessRuleException>(exception =>
            new ProblemDetails
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status422UnprocessableEntity
            });
    }
}
```

---

## OpenAPI / Scalar Configuration

OpenAPI and Scalar are presentation concerns and belong in the Presentation.Api `Module`.

### OpenAPI Security Scheme

The `AddDocumentTransformer` registers a JWT Bearer security scheme in the OpenAPI document so Scalar (and any OpenAPI consumer) knows the API uses Bearer token authentication.

### Scalar Authentication

`MapScalarApiReference` is called with `PreferredSecurityScheme = "Bearer"` so the Scalar UI pre-selects the Bearer auth input. Users paste a JWT from the login endpoint and all subsequent requests include the `Authorization: Bearer <token>` header.

### Rules
- OpenAPI and Scalar are only mapped in `Development` environment
- Security scheme type is `Http` with scheme `bearer` and format `JWT`
- The security requirement is applied globally to all endpoints
- Individual endpoints can opt out using `[AllowAnonymous]`

---

## Middleware Pipeline Order

The `UseApi()` method configures middleware in this exact order:

```
1. UseProblemDetails()          → Catches exceptions, returns RFC 7807 responses
2. MapOpenApi()                 → Serves /openapi/v1.json (dev only)
3. MapScalarApiReference()      → Serves /scalar/v1 UI (dev only)
4. UseHttpsRedirection()        → Redirects HTTP to HTTPS
5. UseAuthentication()          → Validates JWT tokens
6. UseAuthorization()           → Enforces [Authorize] attributes
7. MapControllers()             → Maps controller routes
```

**Important:** `UseAuthentication()` must come before `UseAuthorization()`. `UseProblemDetails()` must be first to catch all exceptions.

---

## Controller Template

```csharp
namespace ProjectName.Presentation.Api.Controllers.Feature.v1;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Feature;
using ProjectName.Presentation.Api.Extensions;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public sealed class FeatureController : ControllerBase
{
    private readonly ISender _sender;

    public FeatureController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GetFeatures.Response>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(CancellationToken ct)
    {
        Guid userId = User.GetUserId();
        IReadOnlyList<GetFeatures.Response> result = await _sender.Send(
            new GetFeatures.Query(userId), ct);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(CreateFeature.Response), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateFeatureRequest request,
        CancellationToken ct)
    {
        Guid userId = User.GetUserId();
        CreateFeature.Response result = await _sender.Send(
            new CreateFeature.Command(request.Name, userId), ct);
        return Ok(result);
    }
}

public sealed record CreateFeatureRequest(string Name);
```

### Controller Rules

| Rule | Detail |
|------|--------|
| Always sealed | `public sealed class XController` |
| Always `[ApiController]` | Enables automatic model validation and binding |
| Always `[ApiVersion("1.0")]` | Explicit version on every controller |
| Route template | `api/v{version:apiVersion}/[controller]` |
| Auth by default | `[Authorize]` on class, `[AllowAnonymous]` on exceptions (health, login) |
| Inject `ISender` | Not `IMediator` — use the narrower interface |
| Use `CancellationToken` | Pass `ct` to every `Send()` call |
| `ProducesResponseType` | Annotate every action with expected response types |
| No business logic | Controllers only dispatch to MediatR and return results |
| Get userId from claims | `User.GetUserId()` via extension method |
| Request DTOs | Simple records, declared near the controller |

---

## Startup Integration

The Startup project (`Program.cs`) should be minimal — just wiring:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Application;
using ProjectName.Infrastructure.Db;
using ProjectName.Infrastructure.Security;
using ProjectName.Presentation.Api;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSecurity(builder.Configuration);
builder.Services.AddApi(builder.Configuration, builder.Environment);

WebApplication app = builder.Build();

app.UseApi();

app.Run();
```

**Rules:**
- Startup has NO direct references to OpenAPI, Scalar, ProblemDetails, or middleware ordering
- Startup only calls layer Module methods (`AddApi`, `UseApi`, `AddApplication`, etc.)
- All presentation concerns are encapsulated in the Presentation.Api `Module`

---

## Checklist

When creating or reviewing presentation layer code:

- [ ] Controller is `sealed` with `[ApiController]`, `[ApiVersion]`, and standard route template
- [ ] `[Authorize]` on class (or `[AllowAnonymous]` for public endpoints like health/login)
- [ ] `ISender` injected (not `IMediator`)
- [ ] `CancellationToken` passed to all async operations
- [ ] `ProducesResponseType` on every action
- [ ] No business logic in controllers — dispatch to MediatR only
- [ ] Request DTOs are simple records
- [ ] OpenAPI + Scalar configured in `Module.cs`, not in `Program.cs`
- [ ] `UseApi()` middleware order is correct (ProblemDetails → OpenApi → Scalar → HTTPS → Auth → Controllers)
- [ ] ProblemDetails maps all known domain exceptions
- [ ] Bearer security scheme registered in OpenAPI document transformer
- [ ] Scalar `PreferredSecurityScheme` set to `"Bearer"`
