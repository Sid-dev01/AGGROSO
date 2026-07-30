# Agent Usage

This document summarizes how AI assistance was used while building this assignment.

## Tools Used

- Codex coding agent for repository inspection, code edits, documentation updates, and local verification.
- PowerShell commands for reading files, searching the codebase, checking git status, and running validation commands.
- `rg` for fast codebase search.
- `apply_patch` for source and documentation edits.
- pnpm for dependency management and build checks.
- Node.js syntax checks for API files.
- Next.js build checks for the frontend.
- Web lookup for deployment documentation and current package guidance.

## Representative Prompts

- Implement only the Theme Review functionality without modifying upload or theme generation.
- Implement only the Report Generation module using approved themes.
- Build the frontend in `apps/web` with Next.js, Tailwind, shadcn-style components, TanStack Query, Axios, and a professional SaaS UI.
- Fix frontend hook/runtime issues and connect the frontend to existing backend endpoints.
- Add CORS to the backend for the deployed frontend.
- Replace Railway deployment config with Render deployment config.
- Add route-level Fastify rate limiting.
- Create setup README files and `.env.example` files for API and web.

## Work Delegated To Agents

No work was delegated to separate sub-agents. All code inspection, implementation, documentation, and verification were done directly in the main Codex session.

## Important Agent Mistakes Or Rejected Suggestions

- An initial Theme Review implementation added unnecessary local helper validation functions. This was corrected to follow the existing project style and use Zod for validation.
- An import in `theme.service.js` was placed below other code. It was moved back to the top-level imports.
- A separate `themeResponseSchema.js` file was created unnecessarily. It was removed, and imports were simplified.
- A frontend invalid hook/runtime issue was investigated and fixed by correcting client/provider usage and dependency resolution.
- A multipart upload issue was fixed by letting Axios/browser set the multipart boundary instead of manually forcing the `Content-Type`.
- A temporary suggestion defaulted missing upload dates to the current date. This was rejected and corrected so old local entries show `Upload date unavailable` instead of inventing dates.
- Railway deployment was attempted first, but the generated Railway domain was not reachable from the user's environment. The deployment target was changed to Render.
- The first Render build command used `corepack enable`, which failed on Render's read-only filesystem. The command was corrected to use Render's available `pnpm` directly.
- Rate limiting was first registered globally. The user requested route-level limits instead, so it was changed to per-route `20 requests / 1 minute`.

## Verification

The generated output was verified with the following checks during development:

- API syntax checks:

```bash
node --check apps/api/src/app.js
node --check apps/api/src/server.js
node --check apps/api/src/modules/upload/upload.route.js
node --check apps/api/src/modules/theme/theme.route.js
node --check apps/api/src/modules/report/report.route.js
```

- API app import check:

```bash
node -e "import('./src/app.js').then(() => console.log('app import ok'))"
```

- Fastify route injection checks were used to confirm route-level rate-limit headers were present.

- Prisma schema validation:

```bash
pnpm --filter api exec prisma validate
```

- Frontend checks:

```bash
npx tsc --noEmit --pretty false
npx eslint .
pnpm --filter web build
```

- Deployment config checks:
  - `vercel.json` was parsed as JSON.
  - Railway/Render config files were reviewed against provider documentation.
  - Render build/start commands were adjusted based on actual deployment logs.

## Notes

- Real secrets were not copied into documentation or example environment files.
- Existing project structure was preserved.
- pnpm remains the single package manager for the monorepo.
