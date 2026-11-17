# .NET Integration Testing

## Description

Writes integration tests for ASP.NET Core .NET 9/10 APIs. The real application runs in memory via `WebApplicationFactory<Program>`, against a real PostgreSQL or SQL Server database in Docker (Testcontainers), with data reset between tests by Respawn. Covers endpoint round-trips, EF Core queries and migrations, ProblemDetails error responses, a test authentication scheme, and replacing external HTTP clients.

## When to Use

- Adding endpoint tests for a new or changed controller action
- Verifying EF Core queries, constraints or migrations against the real database engine
- Checking DI wiring, middleware, auth and error mapping end to end
- Setting up `tests/ProjectName.IntegrationTests` with a shared container fixture

## Usage

Load alongside `dotnet-unit-testing` (shared conventions) and `dotnet-code-style`. The skill:

1. Reuses an existing integration-test fixture if the solution has one
2. Sets up `ApiFactory` (WebApplicationFactory + Testcontainers + Respawn) as an xUnit collection fixture
3. Generates endpoint tests: happy path, validation (400), not found (404), auth (401/403)
4. Replaces authentication and third-party HTTP clients — never the database

## Example

```csharp
[Collection(ApiCollection.Name)]
public sealed class OrdersEndpointsTests : ApiTestBase
{
    public OrdersEndpointsTests(ApiFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task Get_UnknownId_Returns404()
    {
        HttpResponseMessage response = await Client.GetAsync(
            $"/api/v1/orders/{Guid.NewGuid()}",
            TestContext.Current.CancellationToken);

        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
    }
}
```

## Requirements

- .NET 9 or 10 SDK; Docker running locally and in CI
- `Microsoft.AspNetCore.Mvc.Testing` (same major version as the app), `Testcontainers.PostgreSql` or `Testcontainers.MsSql`, `Respawn`, `xunit.v3`, `Shouldly`
- `public partial class Program { }` at the end of the Startup project's `Program.cs`
