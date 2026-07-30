# Backend Endpoints Used By The Frontend

The backend connection is already implemented in `src/lib/api.ts`.

## Upload

- `POST /upload`

Uploads a CSV file and returns the created batch details.

## Theme Generation And Review

- `POST /themes/generate/:batchId`
- `GET /themes/:batchId`
- `PATCH /themes/:themeId`

These endpoints generate themes for a batch, load reviewable themes, and update theme status/title/problem statement.

## Reports

- `POST /reports/generate/:batchId`
- `GET /reports/:batchId`

These endpoints generate a management report from approved themes and retrieve an existing report.
