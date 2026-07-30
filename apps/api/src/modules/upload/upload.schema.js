import { z } from "zod";

export const feedbackRowSchema = z.object({
  feedbackText: z.string().min(1),
  source: z.string().min(1),
  userType: z.string().min(1),
  productArea: z.string().min(1),
  feedbackDate: z.coerce.date(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});
