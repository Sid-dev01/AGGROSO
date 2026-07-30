# Full Application Testing Guide

## 1. Start The Backend

From `apps/api`, start the Fastify API using the existing project script.

```bash
npm run dev
```

Make sure the backend environment has its required database and OpenAI variables configured.

## 2. Start The Frontend

From `apps/web`, start Next.js.

```bash
npm run dev
```

Open `http://localhost:3000`.

## 3. Upload Feedback

Go to `Upload CSV`.

Use a CSV with these columns:

```csv
feedbackText,source,userType,productArea,feedbackDate,rating
```

Upload the file and keep the returned batch ID. The app also stores the latest batch in the browser workspace.

## 4. Generate And Review Themes

Go to `Theme Review`.

Enter the batch ID if it is not already selected, then click `Generate themes`.

After themes load:

- Approve themes that should be included in the report.
- Reject themes that should not be included.
- Edit a theme title or problem statement when needed.

Only approved themes are used for report generation.

## 5. Generate A Report

Go to `Reports`.

Enter the same batch ID, then click `Generate report`.

The report should show:

- Executive summary
- Overall sentiment
- Key findings
- Recommendations
- Priority areas
- Theme analysis

## 6. Retrieve An Existing Report

Refresh the page or return to `Reports` later with the same batch ID.

Click `Load report` to fetch the stored report from the backend.

## Troubleshooting

If the frontend shows an invalid hook call after dependency changes, stop any old web dev servers, clear the generated `.next` folder, install dependencies with the workspace package manager, and start the web app again.

If Next.js prints an `@next/swc-win32-x64-msvc` Application Control warning on Windows, the native Next compiler binary is being blocked by Windows policy. The app can still build by falling back to wasm, but removing that warning requires allowing the native `next-swc.win32-x64-msvc.node` binary in Windows Application Control.

For local development in this repository, prefer:

```bash
pnpm install
pnpm dev:web
```
