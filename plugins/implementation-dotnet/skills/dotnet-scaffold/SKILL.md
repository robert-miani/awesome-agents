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
- `dotnet-unit-testing` and `dotnet-integration-testing` — if test projects are requested

---

## Pre-Scaffold Questions (MANDATORY)

**Before scaffolding a new solution, ASK the user these questions:**

1. **Project Name** — What is the project/solution name? (e.g., `Ordering`, `Inventory`)
2. **.NET Version** — Which .NET version? (9 / 10)
3. **Include Consumers?** — Do you need message consumers (Presentation.Consumers)? (yes/no)
4. **Include Infrastructure.Http?** — Do you need HTTP client integration for external APIs? (yes/no)
5. **Database Provider** — Which database? (mssql / postgres)
6. **Generate Docker Compose?** — Should I generate docker-compose.yml for local dependencies? (yes/no)
7. **Dispatch Style** — MediatR (CQRS commands/queries + pipeline behaviours) or plain application services? (mediatr / services). Mention that MediatR 13+ is commercially licensed and needs a license key; 12.x is the last Apache-2.0 line.
8. **Include Test Projects?** — Generate `tests/` with unit and integration test projects? (yes/no; recommend **yes**)

**Wait for answers before proceeding with scaffold.**

The templates in this skill are the **MediatR style**. If the user picks **services**, apply *Dispatch Style = services* below on top of them.

---

## Workflow

Run these steps in order. Each step names the reference file to read **at that step** — don't load them all up front.

1. **Ask the pre-scaffold questions** above and wait for answers.
2. **Create CPM files first** — `Directory.Packages.props` (for the chosen .NET version), `Directory.Build.props`, and copy `templates/.editorconfig` + `templates/.gitignore` to the solution root → `references/packages.md`.
3. **Run the base scaffold script**, then the add-ons the user selected (Consumers, Infrastructure.Http) → `references/scaffold-script.md`.
4. **Generate docker-compose.yml** if requested → `references/docker-compose.md`.
5. **Generate the starter files** (Application module, validation behaviour, health, Db module, DbContext, Api module, Program.cs) → `references/starter-files.md`.
6. **Generate the example "Item" feature** (mandatory) → `references/example-feature.md`.
7. **Dispatch Style = services?** Apply the substitutions in *Dispatch Style = services* below to steps 3, 5 and 6.
8. **Test projects requested?** Follow *Add Test Projects* below.
9. **Verify** — *Post-Scaffold Verification* below. The scaffold is done only when build (and tests, if generated) pass.

---

## CRITICAL: Scaffolding Order

**ALWAYS create `Directory.Packages.props` and `Directory.Build.props` BEFORE adding any NuGet packages.**

If you add packages before CPM is set up, NuGet will pick the latest available versions (often .NET 10 packages on a .NET 9 project), causing build failures.

**If NOT using CPM**, you MUST specify explicit `--version` flags on every `dotnet add package` command.

---

## Dispatch Style = services (If User Selected services)

Apply these changes on top of the MediatR-style templates — everything else stays the same:

1. **Packages** — remove the `MediatR` line from `Directory.Packages.props` and skip `dotnet add ... package MediatR` in the script.
2. **Application/Module.cs** — no `AddMediatR`, no `IPipelineBehavior` registration. Keep `AddValidatorsFromAssembly(assembly, includeInternalTypes: true)` and register each service explicitly: `services.AddScoped<IItemService, ItemService>();`.
3. **Behaviours/ValidationBehaviour.cs** — do not generate it. Each service method validates its own request first.
4. **Health** — replace `Health/GetHealth.cs` with `Health/IHealthService.cs` + `Health/HealthService.cs` returning the same `Response` record; `HealthController` injects `IHealthService` instead of `ISender`.
5. **Example "Item" feature** — generate `Items/IItemService.cs`, `Items/ItemService.cs`, `Items/CreateItemRequest.cs` (record + validator) instead of `CreateItem.cs` / `GetItemById.cs`; `ItemsController` injects `IItemService`.

Templates for every file above: `dotnet-feature` → `references/application-services.md` (rename `Order` → `Item`).

---

## Add Test Projects (If User Selected Yes)

Create, under `tests/`, following the **Project Setup** section of each skill:

| Project | References | Skill |
|---------|------------|-------|
| `tests/$NAME.Domain.UnitTests` | Domain | `dotnet-unit-testing` |
| `tests/$NAME.Application.UnitTests` | Application, Application.Contracts, Domain | `dotnet-unit-testing` |
| `tests/$NAME.IntegrationTests` | Startup (for `WebApplicationFactory<Program>`) | `dotnet-integration-testing` |

Add all three to the solution (`dotnet sln add tests/...`), add the test packages to `Directory.Packages.props`, add `<InternalsVisibleTo Include="$NAME.Application.UnitTests" />` to the Application project, and generate one passing test per project for the example `Item` feature (entity, create handler/service + validator, `POST`/`GET` endpoint round-trip). Then `dotnet test` must pass as part of Post-Scaffold Verification.


---

## Post-Scaffold Verification

After scaffolding, verify the solution:

```bash
dotnet build
dotnet test          # if test projects were generated (integration tests need Docker running)
dotnet run --project src/ProjectName.Startup
```

Test the health endpoint:

```bash
curl https://localhost:5001/api/v1/health
# Response: {"status":"Healthy","timestamp":"2026-03-15T12:00:00Z","version":"1.0.0"}
```

Browse to `/scalar/v1` for interactive API documentation.

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
| **tests** | `Domain.UnitTests`, `Application.UnitTests`, `IntegrationTests` with one test each for the `Item` feature (if included) |

With **Dispatch Style = services**, the Application row is instead `Module.cs`, `Health/IHealthService.cs`, `Health/HealthService.cs`, `Items/IItemService.cs`, `Items/ItemService.cs`, `Items/CreateItemRequest.cs`.

This demonstrates a complete vertical slice from API to database.

---

## Reference Files

| File | Read at step | Contents |
|------|--------------|----------|
| `references/packages.md` | 2 | CPM (`Directory.Packages.props` for .NET 9 and 10, `Directory.Build.props`), template files, how CPM works, pinned package versions, MediatR licensing note |
| `references/scaffold-script.md` | 3 | Base scaffold bash script; add-on scripts for Consumers and Infrastructure.Http |
| `references/docker-compose.md` | 4 | PostgreSQL, SQL Server and RabbitMQ compose files and matching `appsettings.Development.json` |
| `references/starter-files.md` | 5 | Application/Infrastructure/Presentation module files, `ValidationBehaviour`, health check, `AppDbContext`, `Program.cs` |
| `references/example-feature.md` | 6 | Full "Item" vertical slice: entity, repository, unit of work, configuration, command/query, controller |
| `templates/.editorconfig`, `templates/.gitignore` | 2 | Copied verbatim to the solution root |
