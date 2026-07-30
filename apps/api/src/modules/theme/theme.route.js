import { generateThemesController } from "./theme.controller.js";

async function themeRoutes(fastify) {
  fastify.post("/generate/:batchId", generateThemesController);
}

export default themeRoutes;