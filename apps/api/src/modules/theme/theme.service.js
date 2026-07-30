import prisma from "../../config/prisma.js";
import { ToLowerCase } from "../../utils/themes.js";
import { generateThemesFromAI } from "../../services/ai/themeGenerator.js";

import {
  getFeedbackByBatchId,
  getAllThemes,
  createTheme,
  createThemeFeedbacks,
  getThemesForBatch,
  updateTheme,
} from "./theme.repository.js";

export const generateThemesService = async (batchId) => {

  const feedbacks = await getFeedbackByBatchId(prisma, batchId);

  if (feedbacks.length === 0) {
    throw new Error("No feedback found for this batch.");
  }

  const existingThemes = await getAllThemes(prisma);

  const aiResponse = await generateThemesFromAI(
    feedbacks,
    existingThemes
  );

  if (!aiResponse.themes.length) {
    throw new Error("AI did not generate any themes.");
  }

  const themeMap = new Map();

  for (const theme of existingThemes) {
    themeMap.set(ToLowerCase(theme.title), theme);
  }

  const validFeedbackIds = new Set(
    feedbacks.map((feedback) => feedback.id)
  );

  const assignedFeedbackIds = new Set();

  return prisma.$transaction(async (tx) => {
    const mappings = [];

    for (const aiTheme of aiResponse.themes) {
      let theme = themeMap.get(ToLowerCase(aiTheme.title));

      if (!theme) {
        theme = await createTheme(tx, {
          title: aiTheme.title,
          problemStatement: aiTheme.problemStatement,
          aiConfidence: aiTheme.confidence,
        });

        themeMap.set(ToLowerCase(theme.title), theme);
      }

      for (const feedbackId of aiTheme.feedbackIds) {
        if (!validFeedbackIds.has(feedbackId)) {
          continue;
        }

        if (assignedFeedbackIds.has(feedbackId)) {
          continue;
        }

        assignedFeedbackIds.add(feedbackId);

        mappings.push({
          themeId: theme.id,
          feedbackId,
        });
      }
    }

    if (mappings.length > 0) {
      await createThemeFeedbacks(tx, mappings);
    }

    return {
      batchId,
      totalFeedback: feedbacks.length,
      totalThemes: aiResponse.themes.length,
      themes: aiResponse.themes,
    };
  });
};

export const getThemesForBatchService = async (batchId) => {
  const themes = await getThemesForBatch(prisma, batchId);

  return themes.map(({ _count, ...theme }) => ({
    ...theme,
    feedbackCount: _count.feedbacks,
  }));
};

export const updateThemeService = async (themeId, updates) => {
  try {
    return await updateTheme(prisma, themeId, updates);
  } catch (error) {
    if (error?.code === "P2025") {
      const notFoundError = new Error("Theme not found.");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
};
