import { z } from "zod";

export const uploadFileSchema = z.object({
  mimetype: z.literal("text/csv"),
});