import prisma from "../../config/prisma.js";
import { parse } from "csv-parse/sync";
import {
  createUploadBatch,
  createFeedbacks,
} from "./upload.repository.js";

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

  return prisma.$transaction(async (tx) => {
    const batch = await createUploadBatch(tx, {
      fileName: file.filename,
      totalRecords: records.length,
    });

    await createFeedbacks(
      tx,
      records.map((record) => ({
        feedbackText: record.feedbackText,
        source: record.source,
        userType: record.userType,
        productArea: record.productArea,
        feedbackDate: new Date(record.feedbackDate),
        rating: record.rating ? Number(record.rating) : null,
        batchId: batch.id,
      }))
    );

    return {
      batchId: batch.id,
      totalRecords: records.length,
    };
  });
};