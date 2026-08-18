import { FastifyInstance } from "fastify";
import { toFastifySchema } from "../schemas/to-fastify-schema";
import { HealthResponseSchema } from "../schemas/health";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get(
    "/api/health",
    {
      schema: {
        tags: ["System"],
        summary: "Check API health",
        response: {
          200: toFastifySchema(HealthResponseSchema),
        },
      },
    },
    async () => {
      return { status: "ok" };
    }
  );
}
