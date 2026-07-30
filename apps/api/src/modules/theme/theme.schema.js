import { z } from "zod";

export const aiThemeSchema = z.object({
  title: z.string().min(1),
  problemStatement: z.string().min(1),
  confidence: z.number().min(0).max(1),
  feedbackIds: z.array(z.string()).min(1),
});

export const aiThemeResponseSchema = z.object({
  themes: z.array(aiThemeSchema).min(1),
});