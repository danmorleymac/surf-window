// src/routes/forecast.ts

import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { ForecastErrorSchema, ForecastResponseSchema } from "../schemas/forecast";
import { getCroydeForecast } from "../services/forecastService";

export function registerForecastRoutes(app: FastifyInstance): void {
  app.get(
    "/api/spots/croyde/forecast",
    {
      schema: {
        response: {
          200: z.toJSONSchema(ForecastResponseSchema),
          502: z.toJSONSchema(ForecastErrorSchema),
        },
      },
    },
    async (_request, reply) => {
      try {
        return await getCroydeForecast();
      } catch (error) {
        app.log.error(error);

        return reply.status(502).send({
          error: "Unable to retrieve marine forecast",
        });
      }
    }
  );
}
