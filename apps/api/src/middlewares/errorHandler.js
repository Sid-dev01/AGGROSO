import { ZodError } from "zod";

const errorHandler = async (error, request, reply) => {
  request.log.error(error);

  const statusCode = error instanceof ZodError
    ? 400
    : error.statusCode || 500;

  return reply.status(statusCode).send({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default errorHandler;
