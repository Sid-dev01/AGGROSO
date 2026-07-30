# Swagger

Swagger is configured with:

- `@fastify/swagger`
- `@fastify/swagger-ui`

The plugins are registered in [src/app.js](../src/app.js).

## Swagger UI

From `apps/api`, start the API server:

```bash
npm run dev
```

Open Swagger UI:

- [http://localhost:4001/documentation](http://localhost:4001/documentation)

Open the generated OpenAPI JSON:

- [http://localhost:4001/documentation/json](http://localhost:4001/documentation/json)

## OpenAPI Source

The OpenAPI document is generated from Fastify route schemas.

Route schema locations:

| Area | File |
| --- | --- |
| Health | [src/app.js](../src/app.js) |
| Upload | [src/modules/upload/upload.route.js](../src/modules/upload/upload.route.js) |
| Themes | [src/modules/theme/theme.route.js](../src/modules/theme/theme.route.js) |
| Reports | [src/modules/report/report.route.js](../src/modules/report/report.route.js) |

## Validation

Request validation in controllers and services continues to use Zod. Swagger schemas document the HTTP API and provide Fastify route metadata.
