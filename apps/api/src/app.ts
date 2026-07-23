// src/app.ts

import Fastify from "fastify";

import { registerForecastRoutes } from "./routes/forecast.js";
import { registerHealthRoutes } from "./routes/health.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  registerHealthRoutes(app);
  registerForecastRoutes(app);

  return app;
}
