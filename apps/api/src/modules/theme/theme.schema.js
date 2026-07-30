import { z } from "zod";

export const themeStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const batchIdParamsSchema = z.object({
  batchId: z.string().trim().min(1),
});

export const themeIdParamsSchema = z.object({
  themeId: z.string().trim().min(1),
});

export const updateThemeSchema = z
  .object({
    status: themeStatusSchema.optional(),
    title: z.string().trim().min(1).optional(),
    problemStatement: z.string().trim().min(1).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be supplied.",
  });

export const aiThemeSchema = z.object({
  title: z.string().min(1),
  problemStatement: z.string().min(1),
  confidence: z.number().min(0).max(1),
  feedbackIds: z.array(z.string()).min(1),
});

export const aiThemeResponseSchema = z.object({
  themes: z.array(aiThemeSchema).min(1),
});
