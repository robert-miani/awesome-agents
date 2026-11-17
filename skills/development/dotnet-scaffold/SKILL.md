---
name: dotnet-scaffold
description: >
  Scaffold new .NET 9/10 clean architecture solutions. Use this skill when the user wants to
  create a new project, generate a solution, or bootstrap a .NET application from scratch.
  Trigger on phrases like "create project", "scaffold solution", "new solution", "bootstrap",
  "generate project", "start new project", "init project", or any request to create a new
  .NET solution structure.
---

# Scaffold Skill (.NET 9/10)

You scaffold new .NET 9/10 clean architecture solutions. Before scaffolding, you MUST ask the pre-scaffold questions and wait for answers.

**PREREQUISITES:** Load these skills before scaffolding:
- `dotnet-architecture` — for layer structure and project references
- `dotnet-code-style` — for code conventions

---

## Pre-Scaffold Questions (MANDATORY)

**Before scaffolding a new solution, ASK the user these questions:**

1. **Project Name** — What is the project/solution name? (e.g., `Ordering`, `Inventory`)
2. **.NET Version** — Which .NET version? (9 / 10)
3. **Include Consumers?** — Do you need message consumers (Presentation.Consumers)? (yes/no)
4. **Include Infrastructure.Http?** — Do you need HTTP client integration for external APIs? (yes/no)
5. **Database Provider** — Which database? (mssql / postgres)
6. **Generate Docker Compose?** — Should I generate docker-compose.yml for local dependencies? (yes/no)

**Wait for answers before proceeding with scaffold.**

---

## Central Package Management (CPM)

All scaffolded solutions use Central Package Management. Package versions are defined once in `Directory.Packages.props` at the solution root.

### Directory.Packages.props (.NET 9)

```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
  </PropertyGroup>

  <ItemGroup Label="Core">
    <PackageVersion Include="MediatR" Version="14.1.0" />
    <PackageVersion Include="FluentValidation.DependencyInjectionExtensions" Version="12.1.1" />
  </ItemGroup>

  <ItemGroup Label="Entity Framework Core">
    <PackageVersion Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.4" />
    <PackageVersion Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.4" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.4" />
    <PackageVersion Include="EFCore.NamingConventions" Version="9.0.0" />
  </ItemGroup>

  <ItemGroup Label="Microsoft Extensions">
    <PackageVersion Include="Microsoft.Extensions.Http" Version="9.0.3" />
    <PackageVersion Include="Microsoft.Extensions.Options.ConfigurationExtensions" Version="9.0.3" />
    <PackageVersion Include="Microsoft.Extensions.Configuration.Binder" Version="9.0.3" />
    <PackageVersion Include="Microsoft.Extensions.Options.DataAnnotations" Version="9.0.3" />
  </ItemGroup>

  <ItemGroup Label="API">
    <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="9.0.3" />
    <PackageVersion Include="Scalar.AspNetCore" Version="1.2.74" />
    <PackageVersion Include="Asp.Versioning.Mvc" Version="8.1.0" />
    <PackageVersion Include="Asp.Versioning.Mvc.ApiExplorer" Version="8.1.0" />
    <PackageVersion Include="Hellang.Middleware.ProblemDetails" Version="6.5.1" />
  </ItemGroup>
</Project>
```

### Directory.Packages.props (.NET 10)

```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
  </PropertyGroup>

  <ItemGroup Label="Core">
    <PackageVersion Include="MediatR" Version="14.1.0" />
    <PackageVersion Include="FluentValidation.DependencyInjectionExtensions" Version="12.1.1" />
  </ItemGroup>

  <ItemGroup Label="Entity Framework Core">
    <PackageVersion Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.5" />
    <PackageVersion Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="10.0.5" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.5" />
    <PackageVersion Include="EFCore.NamingConventions" Version="10.0.0" />
  </ItemGroup>

  <ItemGroup Label="Microsoft Extensions">
    <PackageVersion Include="Microsoft.Extensions.Http" Version="10.0.5" />
    <PackageVersion Include="Microsoft.Extensions.Options.ConfigurationExtensions" Version="10.0.5" />
    <PackageVersion Include="Microsoft.Extensions.Configuration.Binder" Version="10.0.5" />
    <PackageVersion Include="Microsoft.Extensions.Options.DataAnnotations" Version="10.0.5" />
  </ItemGroup>

  <ItemGroup Label="API">
    <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="10.0.5" />
    <PackageVersion Include="Scalar.AspNetCore" Version="2.13.8" />
    <PackageVersion Include="Asp.Versioning.Mvc" Version="8.1.0" />
    <PackageVersion Include="Asp.Versioning.Mvc.ApiExplorer" Version="8.1.0" />
    <PackageVersion Include="Hellang.Middleware.ProblemDetails" Version="6.5.1" />
  </ItemGroup>
</Project>
```

### Directory.Build.props

```xml
<Project>
  <PropertyGroup>
    <Nullable>enable</Nullable>
    <ImplicitUsings>disable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
</Project>
```

### Template Files

The following template files are stored in `templates/` folder within this skill directory. **Copy these files to the solution root during scaffolding.**

| File | Description |
|------|-------------|
| `templates/.editorconfig` | C# code style and formatting rules (from `dotnet-code-style` skill) |
| `templates/.gitignore` | Standard .NET/Visual Studio ignore patterns |

### How CPM Works

1. `Directory.Packages.props` defines all package versions centrally
2. Individual `.csproj` files reference packages WITHOUT versions:
   ```xml
   <PackageReference Include="MediatR" />
   ```
3. NuGet resolves the version from `Directory.Packages.props`
4. To override a version in a specific project (rare):
   ```xml
   <PackageReference Include="MediatR" VersionOverride="12.3.0" />
   ```

---

## CRITICAL: Scaffolding Order

**ALWAYS create `Directory.Packages.props` and `Directory.Build.props` BEFORE adding any NuGet packages.**

If you add packages before CPM is set up, NuGet will pick the latest available versions (often .NET 10 packages on a .NET 9 project), causing build failures.

**If NOT using CPM**, you MUST specify explicit `--version` flags on every `dotnet add package` command.

---

## Package Versions Reference

### .NET 9 Package Versions

| Package | Version |
|---------|--------|
| MediatR | 14.1.0 |
| FluentValidation.DependencyInjectionExtensions | 12.1.1 |
| Npgsql.EntityFrameworkCore.PostgreSQL | 9.0.4 |
| Microsoft.EntityFrameworkCore.SqlServer | 9.0.4 |
| EFCore.NamingConventions | 9.0.0 |
| Microsoft.Extensions.Http | 9.0.3 |
| Microsoft.Extensions.Options.ConfigurationExtensions | 9.0.3 |
| Microsoft.Extensions.Options.DataAnnotations | 9.0.3 |
| Microsoft.AspNetCore.OpenApi | 9.0.3 |
| Scalar.AspNetCore | 1.2.74 |

### .NET 10 Package Versions

| Package | Version |
|---------|--------|
| MediatR | 14.1.0 |
| FluentValidation.DependencyInjectionExtensions | 12.1.1 |
| Npgsql.EntityFrameworkCore.PostgreSQL | 10.0.5 |
| Microsoft.EntityFrameworkCore.SqlServer | 10.0.5 |
| EFCore.NamingConventions | 10.0.0 |
| Microsoft.Extensions.Http | 10.0.5 |
| Microsoft.Extensions.Options.ConfigurationExtensions | 10.0.5 |
| Microsoft.Extensions.Options.DataAnnotations | 10.0.5 |
| Microsoft.AspNetCore.OpenApi | 10.0.5 |
| Scalar.AspNetCore | 2.13.8 |

---

## Scaffold Script

### Base Scaffold (Always Run)

```bash
#!/bin/bash
set -e
NAME=$1           # Project name
NET_VERSION=$2    # 9 | 10
DB=$3             # mssql | postgres

# Set target framework and package versions based on .NET version
if [ "$NET_VERSION" = "10" ]; then
  TFM="net10.0"
  EF_VERSION="10.0.5"
  EXTENSIONS_VERSION="10.0.5"
  OPENAPI_VERSION="10.0.5"
  SCALAR_VERSION="2.13.8"
  NAMING_CONVENTIONS_VERSION="10.0.0"
  MEDIATR_VERSION="14.1.0"
  FLUENT_VERSION="12.1.1"
else
  TFM="net9.0"
  EF_VERSION="9.0.4"
  EXTENSIONS_VERSION="9.0.3"
  OPENAPI_VERSION="9.0.3"
  SCALAR_VERSION="1.2.74"
  NAMING_CONVENTIONS_VERSION="9.0.0"
  MEDIATR_VERSION="14.1.0"
  FLUENT_VERSION="12.1.1"
fi

mkdir -p $NAME && cd $NAME
dotnet new sln -n $NAME

# ============================================
# CENTRAL PACKAGE MANAGEMENT (create FIRST)
# ============================================

# Create Directory.Packages.props
cat > Directory.Packages.props << EOF
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
  </PropertyGroup>

  <ItemGroup Label="Core">
    <PackageVersion Include="MediatR" Version="${MEDIATR_VERSION}" />
    <PackageVersion Include="FluentValidation.DependencyInjectionExtensions" Version="${FLUENT_VERSION}" />
  </ItemGroup>

  <ItemGroup Label="Entity Framework Core">
    <PackageVersion Include="Microsoft.EntityFrameworkCore.Design" Version="${EF_VERSION}" />
    <PackageVersion Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="${EF_VERSION}" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.SqlServer" Version="${EF_VERSION}" />
    <PackageVersion Include="EFCore.NamingConventions" Version="${NAMING_CONVENTIONS_VERSION}" />
  </ItemGroup>

  <ItemGroup Label="Microsoft Extensions">
    <PackageVersion Include="Microsoft.Extensions.Http" Version="${EXTENSIONS_VERSION}" />
    <PackageVersion Include="Microsoft.Extensions.Options.ConfigurationExtensions" Version="${EXTENSIONS_VERSION}" />
    <PackageVersion Include="Microsoft.Extensions.Configuration.Binder" Version="${EXTENSIONS_VERSION}" />
    <PackageVersion Include="Microsoft.Extensions.Options.DataAnnotations" Version="${EXTENSIONS_VERSION}" />
  </ItemGroup>

  <ItemGroup Label="API">
    <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="${OPENAPI_VERSION}" />
    <PackageVersion Include="Scalar.AspNetCore" Version="${SCALAR_VERSION}" />
    <PackageVersion Include="Asp.Versioning.Mvc" Version="8.1.0" />
    <PackageVersion Include="Asp.Versioning.Mvc.ApiExplorer" Version="8.1.0" />
    <PackageVersion Include="Hellang.Middleware.ProblemDetails" Version="6.5.1" />
  </ItemGroup>
</Project>
EOF

# Create Directory.Build.props
cat > Directory.Build.props << EOF
<Project>
  <PropertyGroup>
    <TargetFramework>${TFM}</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>disable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
</Project>
EOF

# Copy template files from skill directory
# NOTE: When scaffolding, copy these files from:
#   - skills/dotnet-scaffold/templates/.gitignore
#   - skills/dotnet-scaffold/templates/.editorconfig
# Use the create_file tool to create them in the solution root

# ============================================
# CREATE PROJECTS
# ============================================

dotnet new webapi   -n $NAME.Startup                    -o src/$NAME.Startup                    --framework $TFM
dotnet new classlib -n $NAME.Domain                     -o src/Domain/$NAME.Domain              --framework $TFM
dotnet new classlib -n $NAME.Application.Contracts      -o src/Application/$NAME.Application.Contracts --framework $TFM
dotnet new classlib -n $NAME.Application                -o src/Application/$NAME.Application    --framework $TFM
dotnet new classlib -n $NAME.Infrastructure.Db          -o src/Infrastructure/$NAME.Infrastructure.Db --framework $TFM
dotnet new classlib -n $NAME.Presentation.Api           -o src/Presentation/$NAME.Presentation.Api --framework $TFM

# Add to solution
dotnet sln add src/$NAME.Startup
dotnet sln add src/Domain/$NAME.Domain
dotnet sln add src/Application/$NAME.Application.Contracts
dotnet sln add src/Application/$NAME.Application
dotnet sln add src/Infrastructure/$NAME.Infrastructure.Db
dotnet sln add src/Presentation/$NAME.Presentation.Api

# ============================================
# PROJECT REFERENCES
# ============================================

dotnet add src/$NAME.Startup/                               reference src/Presentation/$NAME.Presentation.Api
dotnet add src/$NAME.Startup/                               reference src/Application/$NAME.Application
dotnet add src/$NAME.Startup/                               reference src/Infrastructure/$NAME.Infrastructure.Db

dotnet add src/Application/$NAME.Application.Contracts/     reference src/Domain/$NAME.Domain
dotnet add src/Application/$NAME.Application/               reference src/Application/$NAME.Application.Contracts
dotnet add src/Application/$NAME.Application/               reference src/Domain/$NAME.Domain
dotnet add src/Infrastructure/$NAME.Infrastructure.Db/      reference src/Application/$NAME.Application.Contracts
dotnet add src/Infrastructure/$NAME.Infrastructure.Db/      reference src/Domain/$NAME.Domain
dotnet add src/Presentation/$NAME.Presentation.Api/         reference src/Application/$NAME.Application
dotnet add src/Presentation/$NAME.Presentation.Api/         reference src/Application/$NAME.Application.Contracts

# ============================================
# NUGET PACKAGES (with explicit versions as safety)
# CPM will use these versions, but explicit flags ensure
# correct versions even if CPM isn't picked up
# ============================================

dotnet add src/Application/$NAME.Application/               package MediatR --version $MEDIATR_VERSION
dotnet add src/Application/$NAME.Application/               package FluentValidation.DependencyInjectionExtensions --version $FLUENT_VERSION
dotnet add src/Infrastructure/$NAME.Infrastructure.Db/      package Microsoft.Extensions.Options.ConfigurationExtensions --version $EXTENSIONS_VERSION
dotnet add src/Infrastructure/$NAME.Infrastructure.Db/      package Microsoft.Extensions.Options.DataAnnotations --version $EXTENSIONS_VERSION
dotnet add src/Presentation/$NAME.Presentation.Api/         package Microsoft.AspNetCore.OpenApi --version $OPENAPI_VERSION
dotnet add src/Presentation/$NAME.Presentation.Api/         package Scalar.AspNetCore --version $SCALAR_VERSION
dotnet add src/Presentation/$NAME.Presentation.Api/         package Asp.Versioning.Mvc
dotnet add src/Presentation/$NAME.Presentation.Api/         package Asp.Versioning.Mvc.ApiExplorer
dotnet add src/Presentation/$NAME.Presentation.Api/         package Hellang.Middleware.ProblemDetails

# Database-specific packages
if [ "$DB" = "postgres" ]; then
  dotnet add src/Infrastructure/$NAME.Infrastructure.Db/    package Npgsql.EntityFrameworkCore.PostgreSQL --version $EF_VERSION
  dotnet add src/Infrastructure/$NAME.Infrastructure.Db/    package EFCore.NamingConventions --version $NAMING_CONVENTIONS_VERSION
else
  dotnet add src/Infrastructure/$NAME.Infrastructure.Db/    package Microsoft.EntityFrameworkCore.SqlServer --version $EF_VERSION
fi

# ============================================
# CSPROJ MODIFICATIONS
# ============================================

# Add FrameworkReference to Presentation.Api (required for controllers in classlib)
PRESENTATION_API_CSPROJ="src/Presentation/$NAME.Presentation.Api/$NAME.Presentation.Api.csproj"
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  powershell -Command "(Get-Content '$PRESENTATION_API_CSPROJ') -replace '<Project Sdk=\"Microsoft.NET.Sdk\">', '<Project Sdk=\"Microsoft.NET.Sdk\">`n  <ItemGroup>`n    <FrameworkReference Include=\"Microsoft.AspNetCore.App\" />`n  </ItemGroup>' | Set-Content '$PRESENTATION_API_CSPROJ'"
else
  sed -i 's/<Project Sdk="Microsoft.NET.Sdk">/<Project Sdk="Microsoft.NET.Sdk">\n  <ItemGroup>\n    <FrameworkReference Include="Microsoft.AspNetCore.App" \/>\n  <\/ItemGroup>/' "$PRESENTATION_API_CSPROJ"
fi

# Remove default OpenApi package from Startup (it comes from Presentation.Api transitively)
STARTUP_CSPROJ="src/$NAME.Startup/$NAME.Startup.csproj"
dotnet remove "$STARTUP_CSPROJ" package Microsoft.AspNetCore.OpenApi 2>/dev/null || true

echo "✅ $NAME base solution scaffolded with .NET $NET_VERSION, $DB, and Central Package Management."
```

### Add Consumers (If User Selected Yes)

```bash
# Run if user wants Presentation.Consumers
dotnet new classlib -n $NAME.Presentation.Consumers     -o src/Presentation/$NAME.Presentation.Consumers
dotnet sln add src/Presentation/$NAME.Presentation.Consumers

dotnet add src/$NAME.Startup/                               reference src/Presentation/$NAME.Presentation.Consumers
dotnet add src/Presentation/$NAME.Presentation.Consumers/   reference src/Application/$NAME.Application
dotnet add src/Presentation/$NAME.Presentation.Consumers/   reference src/Application/$NAME.Application.Contracts

echo "✅ Presentation.Consumers added."
```

### Add Infrastructure.Http (If User Selected Yes)

```bash
# Run if user wants Infrastructure.Http
dotnet new classlib -n $NAME.Infrastructure.Http        -o src/Infrastructure/$NAME.Infrastructure.Http
dotnet sln add src/Infrastructure/$NAME.Infrastructure.Http

dotnet add src/$NAME.Startup/                               reference src/Infrastructure/$NAME.Infrastructure.Http
dotnet add src/Infrastructure/$NAME.Infrastructure.Http/    reference src/Application/$NAME.Application.Contracts

# HTTP client packages (with explicit versions)
dotnet add src/Infrastructure/$NAME.Infrastructure.Http/    package Microsoft.Extensions.Http --version $EXTENSIONS_VERSION
dotnet add src/Infrastructure/$NAME.Infrastructure.Http/    package Microsoft.Extensions.Options.ConfigurationExtensions --version $EXTENSIONS_VERSION
dotnet add src/Infrastructure/$NAME.Infrastructure.Http/    package Microsoft.Extensions.Options.DataAnnotations --version $EXTENSIONS_VERSION

echo "✅ Infrastructure.Http added."
```

---

## Docker Compose Templates

### PostgreSQL docker-compose.yml

```yaml
# docker-compose.yml (PostgreSQL)
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${PROJECT_NAME:-app}-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-appdb}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**appsettings.Development.json for PostgreSQL:**
```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=appdb;Username=postgres;Password=postgres"
  }
}
```

### MSSQL docker-compose.yml

```yaml
# docker-compose.yml (SQL Server)
services:
  mssql:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: ${PROJECT_NAME:-app}-mssql
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: ${SA_PASSWORD:-YourStrong@Passw0rd}
      MSSQL_PID: Developer
    ports:
      - "1433:1433"
    volumes:
      - mssql_data:/var/opt/mssql
    healthcheck:
      test: /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$$MSSQL_SA_PASSWORD" -C -Q "SELECT 1" || exit 1
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mssql_data:
```

**appsettings.Development.json for MSSQL:**
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1433;Database=appdb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
  }
}
```

### Add RabbitMQ (If Consumers Included)

```yaml
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: ${PROJECT_NAME:-app}-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-guest}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS:-guest}
    ports:
      - "5672:5672"    # AMQP
      - "15672:15672"  # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  rabbitmq_data:
```

---

## Starter Files to Generate

**ALWAYS generate these starter files during scaffolding.**

### Application/Module.cs

```csharp
// src/Application/ProjectName.Application/Module.cs
namespace ProjectName.Application;

using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Application.Behaviours;

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
namespace ProjectName.Application.Behaviours;

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using MediatR;

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
namespace ProjectName.Application.Health;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public static class GetHealth
{
    public sealed record Query() : IRequest<Response>;

    public sealed record Response(string Status, DateTime Timestamp, string Version);

    internal sealed class Handler : IRequestHandler<Query, Response>
    {
        public Task<Response> Handle(Query request, CancellationToken cancellationToken)
        {
            Response response = new(
                Status: "Healthy",
                Timestamp: DateTime.UtcNow,
                Version: typeof(Handler).Assembly.GetName().Version?.ToString() ?? "1.0.0");

            return Task.FromResult(response);
        }
    }
}
```

### Infrastructure.Db/Module.cs (PostgreSQL)

```csharp
// src/Infrastructure/ProjectName.Infrastructure.Db/Module.cs
namespace ProjectName.Infrastructure.Db;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Infrastructure.Db.Options;

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
namespace ProjectName.Infrastructure.Db;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Infrastructure.Db.Options;

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
namespace ProjectName.Infrastructure.Db.Options;

using System.ComponentModel.DataAnnotations;

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
namespace ProjectName.Infrastructure.Db;

using Microsoft.EntityFrameworkCore;

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
namespace ProjectName.Infrastructure.Http;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
        //         var opts = sp.GetRequiredService<IOptions<ExternalServiceOptions>>().Value;
        //         client.BaseAddress = new Uri(opts.BaseUrl);
        //     });

        return services;
    }
}
```

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

### Presentation.Api/Controllers/Health/v1/HealthController.cs

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

## Post-Scaffold Verification

After scaffolding, verify the solution:

```bash
dotnet build
dotnet run --project src/ProjectName.Startup
```

Test the health endpoint:

```bash
curl https://localhost:5001/api/v1/health
# Response: {"status":"Healthy","timestamp":"2026-03-15T12:00:00Z","version":"1.0.0"}
```

Browse to `/scalar/v1` for interactive API documentation.

---

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
namespace ProjectName.Domain.Items;

using System;

public sealed class Item
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public decimal Price { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

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
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, string? description, decimal price)
    {
        Name = name;
        Description = description;
        Price = price;
        UpdatedAt = DateTime.UtcNow;
    }
}
```

### Application.Contracts/Persistence/IUnitOfWork.cs

```csharp
// src/Application/ProjectName.Application.Contracts/Persistence/IUnitOfWork.cs
namespace ProjectName.Application.Contracts.Persistence;

using System.Threading;
using System.Threading.Tasks;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
```

### Application.Contracts/Persistence/IItemRepository.cs

```csharp
// src/Application/ProjectName.Application.Contracts/Persistence/IItemRepository.cs
namespace ProjectName.Application.Contracts.Persistence;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ProjectName.Domain.Items;

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
namespace ProjectName.Application.Items;

using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Items;

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
namespace ProjectName.Application.Items;

using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Items;

public static class GetItemById
{
    public sealed record Query(Guid Id) : IRequest<Response?>;

    public sealed record Response(
        Guid Id,
        string Name,
        string? Description,
        decimal Price,
        DateTime CreatedAt,
        DateTime? UpdatedAt);

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
namespace ProjectName.Infrastructure.Db.Persistence;

using System.Threading;
using System.Threading.Tasks;
using ProjectName.Application.Contracts.Persistence;

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
namespace ProjectName.Infrastructure.Db.Persistence;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Domain.Items;

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
namespace ProjectName.Infrastructure.Db.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjectName.Domain.Items;

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
namespace ProjectName.Infrastructure.Db;

using Microsoft.EntityFrameworkCore;
using ProjectName.Domain.Items;

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
namespace ProjectName.Infrastructure.Db;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Infrastructure.Db.Options;
using ProjectName.Infrastructure.Db.Persistence;

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
namespace ProjectName.Presentation.Api.Controllers.Items.v1;

using System;
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectName.Application.Items;

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

## Scaffold Summary

After completing all steps, the solution will contain:

| Layer | Files |
|-------|-------|
| **Domain** | `Items/Item.cs` |
| **Application.Contracts** | `Persistence/IUnitOfWork.cs`, `Persistence/IItemRepository.cs` |
| **Application** | `Module.cs`, `Behaviours/ValidationBehaviour.cs`, `Health/GetHealth.cs`, `Items/CreateItem.cs`, `Items/GetItemById.cs` |
| **Infrastructure.Db** | `Module.cs`, `Options/DatabaseOptions.cs`, `AppDbContext.cs`, `Configurations/ItemConfiguration.cs`, `Persistence/UnitOfWork.cs`, `Persistence/ItemRepository.cs` |
| **Infrastructure.Http** | `Module.cs` (if included) |
| **Presentation.Api** | `Module.cs`, `Routing/SlugifyParameterTransformer.cs`, `Controllers/Health/v1/HealthController.cs`, `Controllers/Items/v1/ItemsController.cs` |
| **Startup** | `Program.cs`, `appsettings.json` |

This demonstrates a complete vertical slice from API to database.
