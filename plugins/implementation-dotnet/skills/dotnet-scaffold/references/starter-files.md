# Scaffold — Starter Files

Files every scaffolded solution gets (MediatR style; for **services** style apply the substitutions in `SKILL.md` → *Dispatch Style = services*). Part of the `dotnet-scaffold` skill.

## Starter Files to Generate

**ALWAYS generate these starter files during scaffolding.**

### Application/Module.cs

```csharp
// src/Application/ProjectName.Application/Module.cs
using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Application.Behaviours;

namespace ProjectName.Application;

public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        Assembly assembly = typeof(Module).Assembly;

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

        return services;
    }
}
```

### Application/Behaviours/ValidationBehaviour.cs

```csharp
// src/Application/ProjectName.Application/Behaviours/ValidationBehaviour.cs
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using MediatR;

namespace ProjectName.Application.Behaviours;

public sealed class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        ValidationContext<TRequest> context = new(request);

        ValidationResult[] validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        List<ValidationFailure> failures = validationResults
            .Where(r => r.Errors.Count > 0)
            .SelectMany(r => r.Errors)
            .ToList();

        if (failures.Count > 0)
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
```

### Application/Health/GetHealth.cs

```csharp
// src/Application/ProjectName.Application/Health/GetHealth.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace ProjectName.Application.Health;

public static class GetHealth
{
    public sealed record Query() : IRequest<Response>;

    public sealed record Response(string Status, DateTimeOffset Timestamp, string Version);

    internal sealed class Handler : IRequestHandler<Query, Response>
    {
        public Task<Response> Handle(Query request, CancellationToken cancellationToken)
        {
            Response response = new(
                Status: "Healthy",
                Timestamp: DateTimeOffset.UtcNow,
                Version: typeof(Handler).Assembly.GetName().Version?.ToString() ?? "1.0.0");

            return Task.FromResult(response);
        }
    }
}
```

### Infrastructure.Db/Module.cs (PostgreSQL)

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Module.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Infrastructure.Db.Options;

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

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(dbOptions.ConnectionString)
                .UseSnakeCaseNamingConvention());

        return services;
    }
}
```

### Infrastructure.Db/Module.cs (SQL Server)

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Module.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Infrastructure.Db.Options;

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

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(dbOptions.ConnectionString));

        return services;
    }
}
```

### Infrastructure.Db/Options/DatabaseOptions.cs

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Options/DatabaseOptions.cs
using System.ComponentModel.DataAnnotations;

namespace ProjectName.Infrastructure.Db.Options;

public sealed class DatabaseOptions
{
    public const string Section = "Database";

    [Required]
    public required string ConnectionString { get; init; }
}
```

### Infrastructure.Db/AppDbContext.cs

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/AppDbContext.cs
using Microsoft.EntityFrameworkCore;

namespace ProjectName.Infrastructure.Db;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Infrastructure.Http/Module.cs

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Http/Module.cs
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ProjectName.Infrastructure.Http;

public static class Module
{
    public static IServiceCollection AddHttpServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register typed HTTP clients here
        // Example:
        // services.AddOptions<ExternalServiceOptions>()
        //     .BindConfiguration(ExternalServiceOptions.Section)
        //     .ValidateDataAnnotations()
        //     .ValidateOnStart();
        //
        // services.AddHttpClient<IExternalService, ExternalServiceClient>(
        //     (sp, client) =>
        //     {
        //         ExternalServiceOptions opts = sp.GetRequiredService<IOptions<ExternalServiceOptions>>().Value;
        //         client.BaseAddress = new Uri(opts.BaseUrl);
        //     });

        return services;
    }
}
```

### Presentation.Api/Routing/SlugifyParameterTransformer.cs

```csharp
// src/Presentation/ProjectName.Presentation.Api/Routing/SlugifyParameterTransformer.cs
using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Routing;

namespace ProjectName.Presentation.Api.Routing;

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
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Presentation.Api.Routing;

namespace ProjectName.Presentation.Api;

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

### Presentation.Api/Controllers/Health/v1/HealthController.cs

```csharp
// src/Presentation/ProjectName.Presentation.Api/Controllers/Health/v1/HealthController.cs
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Health;

namespace ProjectName.Presentation.Api.Controllers.Health.v1;

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
```

### Startup/Program.cs

```csharp
// src/ProjectName.Startup/Program.cs
using ProjectName.Application;
using ProjectName.Infrastructure.Db;
using ProjectName.Presentation.Api;
using Scalar.AspNetCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Layer registrations
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
// builder.Services.AddHttpServices(builder.Configuration);  // Uncomment if Infrastructure.Http included
builder.Services.AddApi(builder.Configuration);

// OpenAPI
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
```

---

