import { z } from "zod";

export const reportResponseSchema = z.object({
  executiveSummary: z.string().min(1),
  overallSentiment: z.enum([
    "Positive",
    "Neutral",
    "Negative",
  ]),
  keyFindings: z.array(z.string().min(1)).min(1),
  recommendations: z.array(z.string().min(1)).min(1),
  priorityAreas: z.array(
    z.object({
      theme: z.string().min(1),
      priority: z.enum([
        "High",
        "Medium",
        "Low",
      ]),
      reason: z.string().min(1),
    })
  ).min(1),
});
