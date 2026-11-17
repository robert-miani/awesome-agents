# Scaffold — Scripts

The base scaffold script (always run) and the optional add-ons for consumers and Infrastructure.Http. Part of the `dotnet-scaffold` skill. Create the CPM files from `references/packages.md` first.

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

