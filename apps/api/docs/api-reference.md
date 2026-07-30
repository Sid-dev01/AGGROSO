# API Reference

Base URL:

```text
http://localhost:4001
```

All successful endpoints return:

```json
{
  "success": true,
  "data": {}
}
```

Error responses return:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Health

### GET /health

Checks whether the API is running and the database is reachable.

Response:

```json
{
  "success": true,
  "message": "Backend is running",
  "database": "connected"
}
```

## Upload

### POST /upload

Uploads a CSV file and stores feedback rows.

Content type:

```text
multipart/form-data
```

Form field:

| Field | Type | Required |
| --- | --- | --- |
| `file` | CSV file | Yes |

Response:

```json
{
  "success": true,
  "data": {
    "batchId": "batch_id",
    "totalRecords": 25
  }
}
```

## Themes

### POST /themes/generate/:batchId

Generates AI themes for feedback records in a batch.

Path params:

| Param | Type | Required |
| --- | --- | --- |
| `batchId` | `string` | Yes |

Response:

```json
{
  "success": true,
  "data": {
    "batchId": "batch_id",
    "totalFeedback": 25,
    "totalThemes": 4,
    "themes": [
      {
        "title": "Checkout Friction",
        "problemStatement": "Customers are having trouble completing checkout.",
        "confidence": 0.82,
        "feedbackIds": ["feedback_id"]
      }
    ]
  }
}
```

### GET /themes/:batchId

Returns themes linked to a batch without returning every feedback record.

Path params:

| Param | Type | Required |
| --- | --- | --- |
| `batchId` | `string` | Yes |

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "theme_id",
      "title": "Checkout Friction",
      "problemStatement": "Customers are having trouble completing checkout.",
      "status": "PENDING",
      "aiConfidence": 0.82,
      "feedbackCount": 8
    }
  ]
}
```

### PATCH /themes/:themeId

Reviews or edits a theme.

Path params:

| Param | Type | Required |
| --- | --- | --- |
| `themeId` | `string` | Yes |

Body:

| Field | Type | Required |
| --- | --- | --- |
| `status` | `PENDING`, `APPROVED`, or `REJECTED` | No |
| `title` | `string` | No |
| `problemStatement` | `string` | No |

Example:

```json
{
  "status": "APPROVED",
  "title": "Checkout Friction",
  "problemStatement": "Customers struggle to finish checkout."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "theme_id",
    "title": "Checkout Friction",
    "problemStatement": "Customers struggle to finish checkout.",
    "status": "APPROVED",
    "aiConfidence": 0.82
  }
}
```

## Reports

### POST /reports/generate/:batchId

Generates a management report using only approved themes linked to a batch.

Path params:

| Param | Type | Required |
| --- | --- | --- |
| `batchId` | `string` | Yes |

Response:

```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "batchId": "batch_id",
    "report": {
      "executiveSummary": "Summary text",
      "overallSentiment": "Neutral",
      "keyFindings": ["Finding text"],
      "recommendations": ["Recommendation text"],
      "priorityAreas": [
        {
          "theme": "Checkout Friction",
          "priority": "High",
          "reason": "Reason text"
        }
      ]
    },
    "createdAt": "2026-07-30T10:00:00.000Z"
  }
}
```

### GET /reports/:batchId

Returns the latest generated report for a batch.

Path params:

| Param | Type | Required |
| --- | --- | --- |
| `batchId` | `string` | Yes |

Response:

```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "batchId": "batch_id",
    "report": {
      "executiveSummary": "Summary text",
      "overallSentiment": "Neutral",
      "keyFindings": ["Finding text"],
      "recommendations": ["Recommendation text"],
      "priorityAreas": [
        {
          "theme": "Checkout Friction",
          "priority": "High",
          "reason": "Reason text"
        }
      ]
    },
    "createdAt": "2026-07-30T10:00:00.000Z"
  }
}
```
