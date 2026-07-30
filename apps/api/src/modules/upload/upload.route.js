import {
  uploadFeedbackController,
} from "./upload.controller.js";

async function uploadRoutes(app) {
  app.post("/", {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: "1 minute",
      },
    },
    schema: {
      tags: ["Upload"],
      summary: "Upload feedback CSV",
      consumes: ["multipart/form-data"],
      response: {
        201: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                batchId: { type: "string" },
                totalRecords: { type: "number" },
              },
            },
          },
        },
      },
    },
  }, uploadFeedbackController);
}

export default uploadRoutes;
