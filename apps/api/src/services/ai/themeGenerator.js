import openai from "../../config/openai.js";
import { zodTextFormat } from "openai/helpers/zod";
import { aiThemeResponseSchema } from "./themeResponseSchema.js";

export const generateThemesFromAI = async (
  feedbacks,
  existingThemes = []
) => {
  const prompt = `
You are a senior Product Analyst.

Your task is to analyze customer feedback and group them into meaningful product themes.

Existing Themes:
${
  existingThemes.length
    ? existingThemes
        .map(
          (theme) =>
            `- ${theme.title}: ${theme.problemStatement}`
        )
        .join("\n")
    : "No existing themes."
}

Rules:

1. Reuse an existing theme whenever appropriate.
2. Create a new theme only if none of the existing themes fit.
3. Every feedbackId must appear exactly once.
4. Theme titles should be short (2-5 words).
5. Problem statements should clearly summarize the issue.
6. Confidence must be between 0 and 1.

Feedback:

${feedbacks
  .map(
    (feedback) => `
ID: ${feedback.id}

Source: ${feedback.source}
User Type: ${feedback.userType}
Product Area: ${feedback.productArea}
Rating: ${feedback.rating ?? "N/A"}

Feedback:
${feedback.feedbackText}
`
  )
  .join("\n----------------------------------------\n")}
`;

  try {
    const response = await openai.responses.parse({
      model: "gpt-4.1-mini",

      input: prompt,

      text: {
        format: zodTextFormat(
          aiThemeResponseSchema,
          "theme_generation"
        ),
      },
    });

    return response.output_parsed;
  } catch (error) {
    console.error("Theme generation failed:", error);

    throw new Error("Failed to generate themes using AI.");
  }
};