# Scaffold — Docker Compose Templates

Only when the user asked for docker-compose (question 6). Part of the `dotnet-scaffold` skill.

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

