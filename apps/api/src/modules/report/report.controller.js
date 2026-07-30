import {
  generateReportService,
  getReportService,
} from "./report.service.js";
import { reportBatchParamsSchema } from "./report.schema.js";

export const generateReportController = async (request, reply) => {
  const { batchId } = reportBatchParamsSchema.parse(request.params);

  const result = await generateReportService(batchId);

  return reply.code(200).send({
    success: true,
    data: result,
  });
};

export const getReportController = async (request, reply) => {
  const { batchId } = reportBatchParamsSchema.parse(request.params);

  const result = await getReportService(batchId);

  return reply.code(200).send({
    success: true,
    data: result,
  });
};
