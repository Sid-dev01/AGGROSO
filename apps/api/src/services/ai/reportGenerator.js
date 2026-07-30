import openai from "../../config/openai.js";
import { zodTextFormat } from "openai/helpers/zod";
import { reportResponseSchema } from "./reportResponseSchema.js";

export const generateReportFromAI = async (approvedThemes) => {
  const prompt = `
You are a Senior Product Analyst.

Generate a structured management report using only the supplied approved themes and feedback.

Rules:

1. Use only the supplied data.
2. Do not invent information.
3. Summarize customer pain points.
4. Identify trends.
5. Prioritize issues.
6. Provide actionable recommendations.
7. Generate an executive summary for management.

Approved Themes:

${approvedThemes
  .map(
    (theme) => `
Theme: ${theme.title}

Problem Statement:
${theme.problemStatement}

Feedback:
${theme.feedbacks
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
  .join("\n")}
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
          reportResponseSchema,
          "report_generation"
        ),
      },
    });

    return response.output_parsed;
  } catch (error) {
    console.error("Report generation failed:", error);

    throw new Error("Failed to generate report using AI.");
  }
};
