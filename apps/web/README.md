# Web Setup

Next.js frontend for the AI customer feedback analysis app.

## Requirements

- Node.js
- pnpm
- Running API service

## Environment

Create `apps/web/.env` from `apps/web/.env.example`.

Required:

```text
NEXT_PUBLIC_API_URL=http://localhost:4001
```

For production, set this to the deployed API origin:

```text
NEXT_PUBLIC_API_URL=https://your-render-api-domain.onrender.com
```

Do not add a trailing slash.

## Development

From the repository root:

```bash
pnpm --filter web dev
```

Web runs at:

```text
http://localhost:3000
```

## Build

From the repository root:

```bash
pnpm --filter web build
```

## Deployment

Deploy this app on Vercel with:

- Root Directory: `apps/web`
- Environment variable: `NEXT_PUBLIC_API_URL`

The `apps/web/vercel.json` file contains the Vercel project config.
