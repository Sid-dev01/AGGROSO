# API Setup

Fastify API for CSV upload, AI theme generation/review, and report generation.

## Requirements

- Node.js
- pnpm
- PostgreSQL
- Gemini API key

## Environment

Create `apps/api/.env` from `apps/api/.env.example`.

Required for local development:

- `DATABASE_URL`
- `GEMINI_API_KEY`
- `CORS_ORIGIN`

Optional local values:

- `PORT`
- `HOST`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DB_PORT`

## Local Database

From `apps/api`:

```bash
docker compose up -d
```

The Docker variables are read from `apps/api/.env`.

## Prisma

From the repository root:

```bash
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
```

## Development

From the repository root:

```bash
pnpm --filter api dev
```

API runs at:

```text
http://localhost:4001
```

Swagger documentation:

```text
http://localhost:4001/documentation
```

Healthcheck:

```text
http://localhost:4001/health
```

## Production

Set production environment variables in Render:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=https://your-vercel-web-domain
NODE_ENV=production
```
