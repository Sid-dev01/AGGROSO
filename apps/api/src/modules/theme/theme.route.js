import {
  generateThemesController,
  getThemesForBatchController,
  updateThemeController,
} from "./theme.controller.js";

async function themeRoutes(fastify) {
  fastify.get("/:batchId", getThemesForBatchController);
  fastify.patch("/:themeId", updateThemeController);
  fastify.post("/generate/:batchId", generateThemesController);
}

export default themeRoutes;
