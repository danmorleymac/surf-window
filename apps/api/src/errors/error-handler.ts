import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "./app-error.js";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppError) {
    request.log.error(error);

    return reply.status(error.statusCode).send({
      error: error.message,
    });
  }

  // Preserve Fastify's normal request-validation behaviour.
  if (error.validation) {
    return reply.status(400).send({
      error: "Invalid request",
    });
  }

  // Anything unexpected is a genuine server error.
  request.log.error(error);

  return reply.status(500).send({
    error: "Internal server error",
  });
}
