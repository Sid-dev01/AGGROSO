import prisma from "../../config/prisma.js";
import { generateReportFromAI } from "../../services/ai/reportGenerator.js";
import {
  getApprovedThemesForBatch,
  createReport,
  getReportByBatchId,
} from "./report.repository.js";

export const generateReportService = async (batchId) => {
  const approvedThemes = await getApprovedThemesForBatch(prisma, batchId);

  if (approvedThemes.length === 0) {
    throw new Error("No approved themes found for this batch.");
  }

  const themes = approvedThemes.map((theme) => ({
    ...theme,
    feedbacks: theme.feedbacks.map(
      (themeFeedback) => themeFeedback.feedback
    ),
  }));

  const report = await generateReportFromAI(themes);

  return prisma.$transaction(async (tx) => {
    return createReport(tx, {
      batchId,
      report,
    });
  });
};

export const getReportService = async (batchId) => {
  const report = await getReportByBatchId(prisma, batchId);

  if (!report) {
    const error = new Error("Report not found.");
    error.statusCode = 404;
    throw error;
  }

  return report;
};
