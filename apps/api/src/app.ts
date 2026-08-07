import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { registerForecastRoutes } from "./routes/forecast.js";
import { registerHealthRoutes } from "./routes/health.js";
import { errorHandler } from "./errors/error-handler.js";

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

  registerHealthRoutes(app);
  registerForecastRoutes(app);

  return app;
}
