---
name: dotnet-unit-testing
description: >
  Writes fast, isolated unit tests for .NET 9/10 layered solutions — domain entities and value
  objects, MediatR handlers or application services, FluentValidation validators, and pure logic —
  using xUnit v3, NSubstitute and Shouldly by default, while following whatever test stack an
  existing solution already uses (NUnit, MSTest, Moq, FluentAssertions, xUnit v2). Use when the
  user asks to "write unit tests", "add tests for this handler/service/validator/entity", "test
  this class", "set up a unit test project", "mock a repository", or mentions xUnit, NUnit,
  MSTest, NSubstitute, Moq, Shouldly, FluentAssertions, Theory/InlineData, or test coverage for
  C# code. Not for HTTP endpoint or database tests — use dotnet-integration-testing for those.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Unit Testing Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

You write unit tests that run in milliseconds, need no database, network, file system or clock, and fail for exactly one reason. Integration concerns (EF Core queries, HTTP pipeline, DI wiring, serialization) belong to `dotnet-integration-testing`.

**RELATED SKILLS:** `dotnet-architecture` (layers, dispatch style), `dotnet-code-style` (applies to test code too), `dotnet-mediatr` / `dotnet-feature` → `references/application-services.md` (what you are testing), `dotnet-fluent-validation`, `dotnet-integration-testing`.

---

## Step 0 — Detect the Existing Test Stack (MANDATORY on existing code)

Look at `tests/` (or `*.Tests` / `*.UnitTests` projects) and `Directory.Packages.props` before adding anything. **Use what is there** — never add a second test framework, mocking library or assertion library to a solution.

| Concern | Look for | Default for new test projects |
|---------|----------|-------------------------------|
| Framework | `xunit.v3`, `xunit` (v2), `NUnit`, `MSTest` | **xUnit v3** (`xunit.v3`) |
| Mocking | `NSubstitute`, `Moq`, `FakeItEasy` | **NSubstitute** (+ `NSubstitute.Analyzers.CSharp`) |
| Assertions | `Shouldly`, `FluentAssertions`, `AwesomeAssertions`, plain `Assert` | **Shouldly** |
| Time | `Microsoft.Extensions.TimeProvider.Testing` | `FakeTimeProvider` when code takes a `TimeProvider` |

**Licensing:** FluentAssertions 8+ is commercially licensed. If a solution is on FluentAssertions 7.x, keep it on 7.x; never upgrade it to 8+ without the team confirming a license. For new projects use Shouldly (or AwesomeAssertions, the Apache-2.0 fork of FluentAssertions, if the team prefers that syntax).

---

## What to Unit Test (and What Not To)

| Test here | Don't test here → where instead |
|-----------|--------------------------------|
| Domain entities, value objects, domain services — invariants, state transitions, calculations | EF Core queries, mappings, migrations → `dotnet-integration-testing` |
| MediatR handlers / application services — orchestration with substituted repositories and clients | Controllers and routing → integration tests (controllers contain no logic) |
| FluentValidation validators — every rule, including edge values | `Module` / DI registration → integration tests (the app must start) |
| Mappers, policies, calculators, any pure function | Third-party libraries and the framework itself |

**Never mock `DbContext` or `DbSet<T>`** — substitute the repository / `IUnitOfWork` interface from `Application.Contracts` instead. If a handler uses `DbContext` directly, test it as an integration test.

---

## Project Setup

One unit test project per tested production project, mirroring its folder structure:

```
tests/
  ProjectName.Domain.UnitTests/          → references ProjectName.Domain
    Orders/OrderTests.cs
  ProjectName.Application.UnitTests/     → references ProjectName.Application (+ .Contracts, Domain)
    Orders/CreateOrderTests.cs           → MediatR style
    Orders/OrderServiceTests.cs          → application-service style
    Orders/CreateOrderValidatorTests.cs
```

```xml
<!-- tests/ProjectName.Application.UnitTests/ProjectName.Application.UnitTests.csproj -->
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>          <!-- xUnit v3 test projects are executables -->
    <IsPackable>false</IsPackable>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" />
    <PackageReference Include="xunit.v3" />
    <PackageReference Include="xunit.runner.visualstudio" />
    <PackageReference Include="NSubstitute" />
    <PackageReference Include="NSubstitute.Analyzers.CSharp" />
    <PackageReference Include="Shouldly" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\src\Application\ProjectName.Application\ProjectName.Application.csproj" />
  </ItemGroup>

</Project>
```

- `TargetFramework`, `Nullable` and `ImplicitUsings` (disabled) come from `Directory.Build.props` — don't repeat them.
- Add the package versions to `Directory.Packages.props` (Central Package Management). Use the current stable versions — check with `dotnet package search <name> --exact-match` — and keep the same versions across all test projects.
- Handlers, services and validators are `internal sealed`. Expose them to the test project from the **production** project:

```xml
<!-- src/Application/ProjectName.Application/ProjectName.Application.csproj -->
<ItemGroup>
  <InternalsVisibleTo Include="ProjectName.Application.UnitTests" />
</ItemGroup>
```

---

## Conventions

- **Class:** `<ClassUnderTest>Tests`, `public sealed`, same namespace as the production class + `.UnitTests` suffix on the root (`ProjectName.Application.UnitTests.Orders`).
- **Method:** `Method_Scenario_ExpectedResult` — `Handle_TotalIsZero_ThrowsValidationException`, `Confirm_OrderIsPending_SetsStatusToConfirmed`.
- **Structure:** Arrange / Act / Assert, separated by blank lines with `// Arrange` `// Act` `// Assert` comments. One behaviour per test; several assertions are fine when they describe that one outcome.
- **Build the SUT in the constructor** (xUnit creates a new instance per test), substitutes in `readonly` fields.
- **Cancellation:** pass `TestContext.Current.CancellationToken` (xUnit v3) to async calls — the xUnit analyzer flags tests that don't.
- **Data-driven:** `[Theory]` + `[InlineData]` for boundaries; `[MemberData]`/`TheoryData<T>` for complex objects.
- **Code style:** all `dotnet-code-style` rules apply — file-scoped namespaces with usings above them, `var` only when the type is apparent, braces always, `_` fields.

---

## Templates

### Domain entity (no substitutes)

```csharp
using System;
using ProjectName.Domain.Orders;
using Shouldly;
using Xunit;

namespace ProjectName.Domain.UnitTests.Orders;

public sealed class OrderTests
{
    [Fact]
    public void Confirm_OrderIsPending_SetsStatusToConfirmed()
    {
        // Arrange
        Order order = new(Guid.NewGuid(), 100m);

        // Act
        order.Confirm();

        // Assert
        order.Status.ShouldBe(OrderStatus.Confirmed);
    }

    [Fact]
    public void Confirm_OrderIsCancelled_Throws()
    {
        // Arrange
        Order order = new(Guid.NewGuid(), 100m);
        order.Cancel();

        // Act
        Action act = () => order.Confirm();

        // Assert
        act.ShouldThrow<InvalidOperationException>();
    }
}
```

### MediatR handler

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Application.Orders;
using ProjectName.Domain.Orders;
using Shouldly;
using Xunit;

namespace ProjectName.Application.UnitTests.Orders;

public sealed class CreateOrderTests
{
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IOrderRepository _orders = Substitute.For<IOrderRepository>();
    private readonly CreateOrder.Handler _handler;

    public CreateOrderTests()
    {
        _unitOfWork.Orders.Returns(_orders);
        _handler = new CreateOrder.Handler(_unitOfWork);
    }

    [Fact]
    public async Task Handle_ValidCommand_AddsOrderAndSaves()
    {
        // Arrange
        Guid customerId = Guid.NewGuid();
        CreateOrder.Command command = new(customerId, 250m);
        CancellationToken ct = TestContext.Current.CancellationToken;

        // Act
        Guid id = await _handler.Handle(command, ct);

        // Assert
        id.ShouldNotBe(Guid.Empty);
        _orders.Received(1).Add(Arg.Is<Order>(o => o.Id == id && o.CustomerId == customerId && o.Total == 250m));
        await _unitOfWork.Received(1).SaveChangesAsync(ct);
    }
}
```

The `ValidationBehaviour` is not part of a handler unit test — test the validator on its own (below).

### Application service (no MediatR)

The validator is real, not substituted — it is deterministic and cheap, and a substituted validator would hide rule bugs.

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using ProjectName.Application.Contracts.Dtos;
using ProjectName.Application.Contracts.Persistence;
using ProjectName.Application.Orders;
using ProjectName.Blocks.Exceptions;
using ProjectName.Domain.Orders;
using Shouldly;
using Xunit;

namespace ProjectName.Application.UnitTests.Orders;

public sealed class OrderServiceTests
{
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IOrderRepository _orders = Substitute.For<IOrderRepository>();
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _unitOfWork.Orders.Returns(_orders);
        _service = new OrderService(_unitOfWork, _orders, new CreateOrderRequestValidator());
    }

    [Fact]
    public async Task CreateAsync_TotalIsZero_ThrowsAndDoesNotSave()
    {
        // Arrange
        CreateOrderRequest request = new(Guid.NewGuid(), 0m);
        CancellationToken ct = TestContext.Current.CancellationToken;

        // Act
        Func<Task> act = () => _service.CreateAsync(request, ct);

        // Assert
        await act.ShouldThrowAsync<ValidationException>();
        await _unitOfWork.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetByIdAsync_OrderMissing_ReturnsNull()
    {
        // Arrange
        Guid id = Guid.NewGuid();
        _orders.GetByIdAsync(id, Arg.Any<CancellationToken>()).Returns((Order?)null);

        // Act
        OrderDto? result = await _service.GetByIdAsync(id, TestContext.Current.CancellationToken);

        // Assert
        result.ShouldBeNull();
    }
}
```

### Validator (FluentValidation test helpers)

```csharp
using System;
using FluentValidation.TestHelper;
using ProjectName.Application.Orders;
using Xunit;

namespace ProjectName.Application.UnitTests.Orders;

public sealed class CreateOrderValidatorTests
{
    public static readonly TheoryData<decimal> NonPositiveTotals = new() { 0m, -0.01m, -100m };

    private readonly CreateOrder.Validator _validator = new();

    [Theory]
    [MemberData(nameof(NonPositiveTotals))]
    public void Validate_TotalNotPositive_HasError(decimal total)
    {
        // Arrange
        CreateOrder.Command command = new(Guid.NewGuid(), total);

        // Act
        TestValidationResult<CreateOrder.Command> result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Total);
    }

    [Fact]
    public void Validate_ValidCommand_HasNoErrors()
    {
        // Arrange
        CreateOrder.Command command = new(Guid.NewGuid(), 10m);

        // Act
        TestValidationResult<CreateOrder.Command> result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
```

Attribute arguments can't be `decimal` constants, so `decimal` (and `DateTimeOffset`, `Guid`, records) theory data goes through `TheoryData<T>` + `[MemberData]`; use `[InlineData]` for `int`, `string`, `bool`, enums. For validators with async rules (`MustAsync`) use `await _validator.TestValidateAsync(command, cancellationToken: ct)`.

---

## Time, Randomness and IDs

- Code that calls `DateTime.UtcNow` / `DateTimeOffset.UtcNow` directly can only be asserted with a tolerance (`ShouldBe(expected, TimeSpan.FromSeconds(5))`). For logic that depends on time (expiry, scheduling), inject `TimeProvider` (.NET 8+) and use `FakeTimeProvider` from `Microsoft.Extensions.TimeProvider.Testing` in tests — propose this refactor rather than testing around the clock.
- Don't assert on generated GUIDs' values — assert they are non-empty and consistent across the objects that share them.

---

## Running

```bash
dotnet test                                             # whole solution
dotnet test tests/ProjectName.Application.UnitTests     # one project
dotnet test --filter "FullyQualifiedName~Orders"        # subset
```

Every new feature ships with its unit tests; all tests must pass before committing.

---

## Gotchas

- **`InternalsVisibleTo` belongs in the production project**, naming the test assembly — not the other way round. Without it, `CreateOrder.Handler` and `OrderService` don't compile in tests.
- **Substituting an `internal` interface** additionally needs `<InternalsVisibleTo Include="DynamicProxyGenAssembly2" />` (Castle proxy). Interfaces in `Application.Contracts` are public, so this is rarely needed.
- **NSubstitute argument matchers** (`Arg.Any`, `Arg.Is`) must be used for *all* arguments of a call or none — mixing a matcher with a literal on the same call misbehaves. `NSubstitute.Analyzers.CSharp` catches this; keep it installed.
- **Over-verification:** use `Received()` only for side effects that are the point of the test (save called, message published). Don't verify every query call — it couples tests to implementation.
- **xUnit v2 vs v3:** `TestContext.Current`, `ValueTask`-based `IAsyncLifetime` and `OutputType Exe` are v3 only. In a v2 solution, use `CancellationToken.None`, `Task`-based `IAsyncLifetime`, and a class-library test project.
- **No shared mutable state** between tests — no `static` fields holding substitutes or data.
- **.NET Framework solutions:** keep the existing framework (often NUnit/MSTest or xUnit v2) and its runner; xUnit v3 requires .NET Framework 4.7.2+ or .NET 8+.
