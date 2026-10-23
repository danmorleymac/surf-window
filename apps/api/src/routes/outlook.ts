import type { FastifyInstance } from "fastify";

import { getOutlook } from "../services/outlook-service.js";

export async function outlookRoutes(app: FastifyInstance) {
  app.get("/api/outlook", async () => {
    return getOutlook();
  });
}
