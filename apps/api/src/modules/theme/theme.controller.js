import { generateThemesService } from "./theme.service.js";

export const generateThemesController = async (request, reply) => {
  const { batchId } = request.params;

  const result = await generateThemesService(batchId);

  return reply.code(200).send({
    success: true,
    data: result,
  });
};