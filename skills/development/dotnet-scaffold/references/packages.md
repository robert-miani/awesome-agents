# Scaffold — Packages and Central Package Management

Read before creating any project: CPM files, Directory.Build.props, template files to copy, and the pinned package versions per .NET version. Part of the `dotnet-scaffold` skill.

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

The following template files are stored in the skill's `templates/` folder (next to `SKILL.md`, not inside `references/`). **Copy these files to the solution root during scaffolding.**

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

**MediatR** is only added when Dispatch Style = mediatr. 14.x needs a license key (commercial license; free community tier for smaller organizations). If the team prefers to stay license-free, pin the last Apache-2.0 release from the 12.x line instead and note it in the README.

---

