import { z } from "zod";

export const reportBatchParamsSchema = z.object({
  batchId: z.string().trim().min(1),
});
