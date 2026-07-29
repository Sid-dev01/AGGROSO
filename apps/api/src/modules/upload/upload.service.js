import prisma from "../../config/prisma.js";
import { parse } from "csv-parse/sync";
import { createUploadBatch, createFeedbacks } from "./upload.repository.js";
import { feedbackRowSchema } from "./upload.schema.js";

export const uploadFeedbackService = async (file) => {
  if (!file) {
    throw new Error("CSV file is required.");
  }

  const buffer = await file.toBuffer();

  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const validatedRecords = feedbackRowSchema.array().parse(records);

  if (validatedRecords.length === 0) {
    throw new Error("CSV file contains no records.");
  }

  return prisma.$transaction(async (tx) => {
    const batch = await createUploadBatch(tx, {
      fileName: file.filename,
      totalRecords: validatedRecords.length,
    });

    const feedbackData = validatedRecords.map((record) => ({
      feedbackText: record.feedbackText,
      source: record.source,
      userType: record.userType,
      productArea: record.productArea,
      feedbackDate: record.feedbackDate,
      rating: record.rating ?? null,
      batchId: batch.id,
    }));

    await createFeedbacks(tx, feedbackData);

    return {
      batchId: batch.id,
      totalRecords: validatedRecords.length,
    };
  });
};
