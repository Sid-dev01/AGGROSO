import ai from "../../config/gemini.js";
import { aiThemeResponseSchema } from "../../modules/theme/theme.schema.js";

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

Return ONLY valid JSON.

Do NOT wrap the response in markdown.

The response MUST exactly follow this structure:

{
  "themes": [
    {
      "title": "string",
      "problemStatement": "string",
      "confidence": 0.95,
      "feedbackIds": ["id1", "id2"]
    }
  ]
}

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
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedResponse = JSON.parse(response.text);

    return aiThemeResponseSchema.parse(parsedResponse);
  } catch (error) {
    console.error("Theme generation failed:", error);

    throw new Error("Failed to generate themes using AI.");
  }
};
