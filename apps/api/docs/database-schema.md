# Database Schema

The API uses Prisma with PostgreSQL. The schema is defined in [prisma/schema.prisma](../prisma/schema.prisma).

## Enums

### ThemeStatus

| Value | Description |
| --- | --- |
| `PENDING` | Theme is awaiting review. |
| `APPROVED` | Theme is approved for report generation. |
| `REJECTED` | Theme is excluded from reports. |

## Tables

### UploadBatch

Stores metadata for each uploaded CSV file.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `fileName` | `String` | Original uploaded file name. |
| `totalRecords` | `Int` | Number of feedback rows stored from the upload. |
| `uploadedAt` | `DateTime` | Created timestamp, defaults to `now()`. |

Relations:

| Relation | Target |
| --- | --- |
| `feedbacks` | `Feedback[]` |
| `reports` | `Report[]` |

### Feedback

Stores individual feedback records parsed from a CSV upload.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `feedbackText` | `String` | Customer feedback text. |
| `source` | `String` | Feedback source. |
| `userType` | `String` | User segment or type. |
| `productArea` | `String` | Product area related to the feedback. |
| `feedbackDate` | `DateTime` | Date attached to the feedback row. |
| `rating` | `Int?` | Optional rating from 1 to 5. |
| `batchId` | `String` | Foreign key to `UploadBatch.id`. |
| `createdAt` | `DateTime` | Created timestamp, defaults to `now()`. |

Indexes:

| Index |
| --- |
| `batchId` |
| `productArea` |
| `feedbackDate` |

### Theme

Stores AI-generated themes. Themes are reviewed before reports are generated.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `title` | `String` | Unique theme title. |
| `problemStatement` | `String` | Summary of the customer problem. |
| `status` | `ThemeStatus` | Defaults to `PENDING`. |
| `aiConfidence` | `Float?` | Optional AI confidence score. |
| `createdAt` | `DateTime` | Created timestamp, defaults to `now()`. |
| `updatedAt` | `DateTime` | Updated automatically by Prisma. |

### ThemeFeedback

Join table between themes and feedback records.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `themeId` | `String` | Foreign key to `Theme.id`. |
| `feedbackId` | `String` | Foreign key to `Feedback.id`. |

Constraints and indexes:

| Constraint or Index |
| --- |
| Unique pair: `themeId`, `feedbackId` |
| Index: `themeId` |
| Index: `feedbackId` |

### Report

Stores generated management reports for upload batches.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `batchId` | `String` | Foreign key to `UploadBatch.id`. |
| `report` | `Json` | Structured AI-generated report. |
| `createdAt` | `DateTime` | Created timestamp, defaults to `now()`. |

Indexes:

| Index |
| --- |
| `batchId` |

### KnowledgeBase

Stores knowledge base content for future use.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `title` | `String` | Knowledge base title. |
| `content` | `String` | Knowledge base content. |
| `createdAt` | `DateTime` | Created timestamp, defaults to `now()`. |
