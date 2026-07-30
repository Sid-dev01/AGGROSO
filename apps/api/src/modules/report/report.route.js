import {
  generateReportController,
  getReportController,
} from "./report.controller.js";

async function reportRoutes(fastify) {
  fastify.post("/generate/:batchId", {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: "1 minute",
      },
    },
    schema: {
      tags: ["Reports"],
      summary: "Generate a report for approved batch themes",
      params: {
        type: "object",
        required: ["batchId"],
        properties: {
          batchId: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                batchId: { type: "string" },
                report: {
                  type: "object",
                  properties: {
                    executiveSummary: { type: "string" },
                    overallSentiment: {
                      type: "string",
                      enum: ["Positive", "Neutral", "Negative"],
                    },
                    keyFindings: {
                      type: "array",
                      items: { type: "string" },
                    },
                    recommendations: {
                      type: "array",
                      items: { type: "string" },
                    },
                    priorityAreas: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          theme: { type: "string" },
                          priority: {
                            type: "string",
                            enum: ["High", "Medium", "Low"],
                          },
                          reason: { type: "string" },
                        },
                      },
                    },
                  },
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
              },
            },
          },
        },
      },
    },
  }, generateReportController);

  fastify.get("/:batchId", {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: "1 minute",
      },
    },
    schema: {
      tags: ["Reports"],
      summary: "Get latest report for a batch",
      params: {
        type: "object",
        required: ["batchId"],
        properties: {
          batchId: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                batchId: { type: "string" },
                report: {
                  type: "object",
                  properties: {
                    executiveSummary: { type: "string" },
                    overallSentiment: {
                      type: "string",
                      enum: ["Positive", "Neutral", "Negative"],
                    },
                    keyFindings: {
                      type: "array",
                      items: { type: "string" },
                    },
                    recommendations: {
                      type: "array",
                      items: { type: "string" },
                    },
                    priorityAreas: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          theme: { type: "string" },
                          priority: {
                            type: "string",
                            enum: ["High", "Medium", "Low"],
                          },
                          reason: { type: "string" },
                        },
                      },
                    },
                  },
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
              },
            },
          },
        },
      },
    },
  }, getReportController);
}

export default reportRoutes;
