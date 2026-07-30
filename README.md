# AGGROSO

AI customer feedback analysis monorepo.

## Apps

- `apps/api`: Fastify, Prisma, PostgreSQL backend.
- `apps/web`: Next.js frontend.

## Requirements

- Node.js
- pnpm
- PostgreSQL, either local Docker Postgres or Neon

## Install

Run from the repository root:

```bash
pnpm install
```

## Environment

Create environment files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Fill in real values before starting the apps.

## Database

For local development, start Postgres from the API folder:

```bash
cd apps/api
docker compose up -d
```

Then run Prisma from the repository root:

```bash
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
```

For production, use the Neon connection string in `apps/api/.env` or in the deployed API environment variables.

## Development

Start the API:

```bash
pnpm --filter api dev
```

Start the web app:

```bash
pnpm --filter web dev
```

Local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:4001`
- Swagger docs: `http://localhost:4001/documentation`
- Healthcheck: `http://localhost:4001/health`

## Build

```bash
pnpm --filter web build
pnpm --filter api exec prisma generate
```

## Deployment

- Deploy the web app from `apps/web` on Vercel.
- Deploy the API from the repo root on Render using `render.yaml`.
- Use Neon PostgreSQL for the production database.
