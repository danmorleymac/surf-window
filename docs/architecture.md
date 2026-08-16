# Surf Window Architecture

## Application architecture

```mermaid
flowchart LR
    Browser["React<br/>TanStack Query"]
    API["Fastify API"]
    DB[("PostgreSQL<br/>surf_spots")]
    Meteo["Open-Meteo API"]

    Browser -->|"HTTP /api"| API
    API -->|"Drizzle ORM"| DB
    API -->|"HTTP"| Meteo
```

### Responsibilities

- **React** — renders the UI and requests forecast data.
- **TanStack Query** — handles API requests, caching and loading/error state.
- **Fastify** — provides the backend HTTP API.
- **Drizzle** — provides typed database queries and migrations.
- **PostgreSQL** — stores surf spot data.
- **Open-Meteo** — provides marine forecast data.

## Local development

```mermaid
flowchart LR
    subgraph Mac["Mac"]
        React["React :5173"]
        Fastify["Fastify :3001"]
    end

    subgraph Docker["Docker"]
        Postgres[("PostgreSQL :5432")]
    end

    OpenMeteo["Open-Meteo"]

    React --> Fastify
    Fastify --> Postgres
    Fastify --> OpenMeteo
```

During normal development, React and Fastify run locally for fast hot-reloading, while PostgreSQL runs in Docker.



# Surf Window Architecture

## Application architecture

```text
┌──────────────────┐
│ React            │
│ TanStack Query   │
└────────┬─────────┘
         │ HTTP
         ▼
┌──────────────────┐
│ Fastify API      │
└────────┬─────────┘
         │
         ├── Drizzle ─────► PostgreSQL
         │
         └── HTTP ────────► Open-Meteo
```

## Local development

```text
YOUR MAC                         DOCKER
────────────────────            ───────────────

React :5173
     │
     ▼
Fastify :3001 ────────────────► PostgreSQL :5432
     │
     ▼
Open-Meteo
```