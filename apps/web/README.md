# Surf Window Web

React frontend for Surf Window.

Displays surf forecasts and allows users to browse surf spots and manage favourites.

## Tech stack

- React
- TypeScript
- Vite
- TanStack Query
- Zod

## Local development

Install dependencies from the **repository root**:

```bash
npm install
```

Start the application from the repository root:

```bash
npm run dev
```

The web application runs at:

`http://localhost:5173`

The Surf Window API must also be running locally for forecast, spot and favourite data to load.

## API data

API requests are handled through the frontend API client.

TanStack Query is used for server state, including:

- Surf spots
- Forecasts
- Favourites
- Favourite mutations and cache invalidation

Shared Zod API contracts live in:

```text
packages/contracts
```

These are used by both the API and web application so response shapes are defined in one place.

## Useful commands

Run web-specific commands from `apps/web`:

```bash
npm run dev          # Start Vite development server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run build        # Create a production build
npm run preview      # Preview the production build
```

Repository-wide checks can be run from the project root using Turborepo:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Project structure

Key frontend areas:

```text
src/
├── components/       # React UI components
├── hooks/            # Reusable application/state logic
├── lib/              # API client and supporting utilities
└── query-options/    # TanStack Query configuration
```

Where UI or state logic becomes reusable or sufficiently complex, it is extracted into custom hooks to keep components focused on rendering and interaction.
