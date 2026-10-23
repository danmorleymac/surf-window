import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { errorHandler } from "./errors/error-handler.js";
import { favouritesRoutes } from "./routes/favourites.js";
import { forecastRoutes } from "./routes/forecast.js";
import { healthRoutes } from "./routes/health.js";
import { outlookRoutes } from "./routes/outlook.js";
import { spotsRoutes } from "./routes/spots.js";

type BuildAppOptions = {
  logger?: boolean;
};

export async function buildApp({ logger = true }: BuildAppOptions = {}) {
  const app = Fastify({
    logger,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Surf Window API",
        description: "API for surf spot marine forecasts",
        version: "1.0.0",
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/documentation",
  });

  app.setErrorHandler(errorHandler);

  await app.register(healthRoutes);
  await app.register(forecastRoutes);
  await app.register(spotsRoutes);
  await app.register(favouritesRoutes);
  await app.register(outlookRoutes);

  return app;
}
