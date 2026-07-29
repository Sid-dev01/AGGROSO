import { uploadFeedbackService } from "./upload.service.js";

export const uploadFeedbackController = async (request, reply) => {
  const file = await request.file();

  const result = await uploadFeedbackService(file);

  return reply.code(201).send({
    success: true,
    data: result,
  });
};