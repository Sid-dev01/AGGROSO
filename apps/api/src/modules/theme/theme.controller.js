import {
  generateThemesService,
  getThemesForBatchService,
  updateThemeService,
} from "./theme.service.js";
import {
  batchIdParamsSchema,
  themeIdParamsSchema,
  updateThemeSchema,
} from "./theme.schema.js";

export const generateThemesController = async (request, reply) => {
  const { batchId } = request.params;

  const result = await generateThemesService(batchId);

  return reply.code(200).send({
    success: true,
    data: result,
  });
};

export const getThemesForBatchController = async (request, reply) => {
  const { batchId } = batchIdParamsSchema.parse(request.params);

  const result = await getThemesForBatchService(batchId);

  return reply.code(200).send({
    success: true,
    data: result,
  });
};

export const updateThemeController = async (request, reply) => {
  const { themeId } = themeIdParamsSchema.parse(request.params);
  const validatedBody = updateThemeSchema.safeParse(request.body);

  if (!validatedBody.success) {
    const error = new Error(validatedBody.error.issues[0]?.message);
    error.statusCode = 400;
    throw error;
  }

  const result = await updateThemeService(themeId, validatedBody.data);

  return reply.code(200).send({
    success: true,
    data: result,
  });
};
