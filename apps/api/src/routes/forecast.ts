import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { getSpotById } from "../db/queries/spots";
import { ForecastErrorSchema } from "../schemas/forecast";
import { ForecastResponseSchema } from "@surf-window/contracts/forecast";

import { toFastifySchema } from "../schemas/to-fastify-schema";
import { getForecastForSpot } from "../services/forecast-service";

const SpotParamsSchema = z.object({
  spotId: z.string(),
});

export function registerForecastRoutes(app: FastifyInstance): void {
  app.get<{
    Params: z.infer<typeof SpotParamsSchema>;
  }>(
    "/api/spots/:spotId/forecast",
    {
      schema: {
        tags: ["Forecast"],
        summary: "Get the marine forecast for a surf spot",
        params: toFastifySchema(SpotParamsSchema),
        response: {
          200: toFastifySchema(ForecastResponseSchema),
          404: toFastifySchema(ForecastErrorSchema),
          502: toFastifySchema(ForecastErrorSchema),
        },
      },
    },
    async (request, reply) => {
      const { spotId } = SpotParamsSchema.parse(request.params);
      const spot = await getSpotById(spotId);

      if (!spot) {
        return reply.status(404).send({
          error: `Unknown surf spot: ${spotId}`,
        });
      }

      return getForecastForSpot(spot);
    }
  );
}
