import {
  generateThemesController,
  getThemesForBatchController,
  updateThemeController,
} from "./theme.controller.js";

async function themeRoutes(fastify) {
  fastify.get("/:batchId", {
    schema: {
      tags: ["Themes"],
      summary: "Get themes for a batch",
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
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  problemStatement: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["PENDING", "APPROVED", "REJECTED"],
                  },
                  aiConfidence: {
                    type: "number",
                    nullable: true,
                  },
                  feedbackCount: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  }, getThemesForBatchController);

  fastify.patch("/:themeId", {
    schema: {
      tags: ["Themes"],
      summary: "Review or edit a theme",
      params: {
        type: "object",
        required: ["themeId"],
        properties: {
          themeId: { type: "string" },
        },
      },
      body: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "APPROVED", "REJECTED"],
          },
          title: { type: "string" },
          problemStatement: { type: "string" },
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
                title: { type: "string" },
                problemStatement: { type: "string" },
                status: {
                  type: "string",
                  enum: ["PENDING", "APPROVED", "REJECTED"],
                },
                aiConfidence: {
                  type: "number",
                  nullable: true,
                },
              },
            },
          },
        },
      },
    },
  }, updateThemeController);

  fastify.post("/generate/:batchId", {
    schema: {
      tags: ["Themes"],
      summary: "Generate AI themes for a batch",
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
                batchId: { type: "string" },
                totalFeedback: { type: "number" },
                totalThemes: { type: "number" },
                themes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      problemStatement: { type: "string" },
                      confidence: { type: "number" },
                      feedbackIds: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, generateThemesController);
}

export default themeRoutes;
