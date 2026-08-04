import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { registerForecastRoutes } from "./routes/forecast.js";
import { registerHealthRoutes } from "./routes/health.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Surf Window API",
        description: "API for retrieving surf forecasts",
        version: "1.0.0",
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/documentation",
  });

  registerHealthRoutes(app);
  registerForecastRoutes(app);

  return app;
}