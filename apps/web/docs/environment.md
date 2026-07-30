# Environment Setup

The frontend connects to the backend through Axios in `src/lib/api.ts`.

Create `apps/web/.env` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

Use the URL and port where your Fastify API is running. The frontend defaults to `http://localhost:4001` when this variable is not set.

After changing `.env`, restart the Next.js dev server.

## Backend CORS

The backend should allow the frontend origin. For local development, the API defaults to:

```env
CORS_ORIGIN=http://localhost:3000
```

Set this in `apps/api/.env` when the frontend runs on a different origin.
