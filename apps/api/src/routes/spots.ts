import type { FastifyInstance } from "fastify";

import { getAllSpots } from "../db/queries/spots.js";
import { SpotsResponseSchema } from "@surf-window/contracts";
import { toFastifySchema } from "../schemas/to-fastify-schema.js";

export function registerSpotRoutes(app: FastifyInstance): void {
  app.get(
    "/api/spots",
    {
      schema: {
        tags: ["Spots"],
        summary: "Get all surf spots",
        response: {
          200: toFastifySchema(SpotsResponseSchema),
        },
      },
    },
    async () => {
      return getAllSpots();
    }
  );
}
