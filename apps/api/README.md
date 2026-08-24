# Surf Window API

Fastify API for Surf Window.

Provides surf spot and forecast data using marine and weather data from Open-Meteo. PostgreSQL is used for application data such as surf spots and favourites.

## Tech stack

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Drizzle ORM
- Zod
- Vitest
- Open-Meteo

## Local development

### Prerequisites

- Node.js 22
- npm
- Docker

Install dependencies from the **repository root**:

```bash
npm install
```

### Environment

Create a local API environment file from the example:

```bash
cp apps/api/.env.example apps/api/.env
```

The `.env` file is local to your machine and is not committed to Git.

### Database

PostgreSQL runs in Docker during local development, while the API and web application run directly on the host machine.

Start only the development database from the repository root:

```bash
docker compose up -d db
```

Check that it is running:

```bash
docker compose ps
```

On a fresh database, apply the existing migrations:

```bash
cd apps/api
npm run db:migrate
```

Then seed the initial surf spot data:

```bash
npm run db:seed
```

### Run the application

From the repository root:

```bash
npm run dev
```

The API runs at:

`http://localhost:3001`

## Database development

The database schema is defined using Drizzle.

When the schema changes, generate a new migration:

```bash
npm run db:generate
```

Apply pending migrations to the current database:

```bash
npm run db:migrate
```

Seed development data:

```bash
npm run db:seed
```

Open Drizzle Studio:

```bash
npm run db:studio
```

The usual schema-change workflow is:

```text
Change the Drizzle schema
        ↓
npm run db:generate
        ↓
Commit the generated migration
        ↓
npm run db:migrate
```

When setting up an existing project on a new machine, you normally **do not** need to generate migrations. The migrations are already committed to Git, so run `db:migrate` followed by `db:seed`.

## Useful commands

Run API-specific commands from `apps/api`:

```bash
npm run dev          # Start the API in watch mode
npm test             # Run the test suite
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run build        # Build the API
npm start            # Run the built API

npm run db:generate  # Generate migrations after a schema change
npm run db:migrate   # Apply pending database migrations
npm run db:seed      # Seed development data
npm run db:studio    # Open Drizzle Studio
```

Repository-wide checks can be run from the project root using Turborepo:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## API documentation

When the API is running, the Swagger UI provides interactive API documentation and allows requests to be sent to the local API.

Swagger reflects the API's route schemas. Sending a request through Swagger calls the real local API, so operations that modify data will modify the local development database.

## Forecast data

Forecast data is assembled from two Open-Meteo APIs:

- Marine forecast — wave height, period and direction
- Weather forecast — wind speed and direction

Marine data is considered the core forecast. If weather data cannot be retrieved, the API can still return the marine forecast with the wind values set to `null`.

Provider-specific Open-Meteo responses are validated inside the API and transformed into Surf Window's shared forecast contract.

Shared API contracts live in:

```text
packages/contracts
```

These contracts are consumed by both the API and web application so that the two applications agree on request and response shapes.

## Troubleshooting

### `relation "surf_spots" does not exist`

This usually means PostgreSQL is running and the API can connect to it, but the database migrations have not yet been applied.

Run:

```bash
cd apps/api
npm run db:migrate
npm run db:seed
```

### Database connection errors

Check that the database container is running:

```bash
docker compose ps
```

Also check that:

```text
apps/api/.env
```

exists and contains the expected `DATABASE_URL`.

A useful distinction when troubleshooting is:

```text
Connection refused
→ PostgreSQL may not be running or DATABASE_URL may be incorrect

"relation ... does not exist"
→ PostgreSQL is reachable, but migrations have not been applied

Tables exist but contain no surf spots
→ migrations have run, but the database probably needs seeding
```

## Stopping the database

Stop the Docker services with:

```bash
docker compose down
```

Avoid adding `-v` unless you intentionally want to delete the local PostgreSQL data volume.
