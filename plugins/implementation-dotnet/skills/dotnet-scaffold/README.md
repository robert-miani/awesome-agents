# .NET Scaffold

## Description

Scaffolds new .NET 9/10 clean architecture solutions from scratch. Generates the full project structure including solution file, all layer projects, Central Package Management (`Directory.Packages.props`), Docker Compose, and correct project references.

## When to Use

- Creating a new .NET solution from scratch
- Bootstrapping a clean architecture project
- Generating a full solution structure with all layers
- Starting a new microservice or API project
- Any request like "create project", "scaffold solution", "new solution", "bootstrap"

## Usage

Activate this skill when creating a new .NET solution. The skill will ask pre-scaffold questions:

1. Project Name (e.g., `Ordering`)
2. .NET Version (9 / 10)
3. Include Consumers? (yes/no)
4. Include Infrastructure.Http? (yes/no)
5. Database Provider (mssql / postgres)
6. Generate Docker Compose? (yes/no)
7. Dispatch Style (mediatr / services)
8. Include Test Projects? (yes/no)

**Prerequisites:** Load `dotnet-architecture` and `dotnet-code-style` first (plus `dotnet-unit-testing` and `dotnet-integration-testing` when test projects are requested).

**Structure:** `SKILL.md` holds the questions and a step-by-step workflow; each step loads only the reference file it needs — `references/packages.md`, `scaffold-script.md`, `docker-compose.md`, `starter-files.md`, `example-feature.md` — and `templates/` holds files copied verbatim to the new solution.

## Example

**Input:** "Create a new .NET 10 solution called Inventory with PostgreSQL"

**Output structure:**

```
src/
  Inventory.Startup/
  Presentation/Inventory.Presentation.Api/
  Application/Inventory.Application/
  Application/Inventory.Application.Contracts/
  Domain/Inventory.Domain/
  Infrastructure/Inventory.Infrastructure.Db/
Directory.Build.props
Directory.Packages.props
Inventory.sln
docker-compose.yml
```

## Requirements

- .NET 9 or 10 SDK installed
- `dotnet-architecture` skill (prerequisite)
- `dotnet-code-style` skill (prerequisite)
