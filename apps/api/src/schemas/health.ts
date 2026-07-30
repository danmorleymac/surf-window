import { z } from "zod";

import { toFastifySchema } from "./to-fastify-schema";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export const healthResponseJsonSchema = toFastifySchema(healthResponseSchema);

export type HealthResponse = z.infer<typeof healthResponseSchema>;
