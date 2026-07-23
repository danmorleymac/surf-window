import { FastifyInstance } from "fastify";
import { healthResponseJsonSchema } from "../schemas/health";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get(
    "/api/health",
    {
      schema: {
        response: {
          200: healthResponseJsonSchema,
        },
      },
    },
    async () => {
      return { status: "ok" };
    }
  );
}
