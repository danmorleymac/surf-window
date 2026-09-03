import { z } from "zod";
import { SpotSchema } from "./spots.js";

// Shared API contract used by both Fastify and React.
export const ForecastHourSchema = z.object({
  tideState: z.enum(["rising", "falling"]).nullable(),
  time: z.string(),
  waveHeight: z.number().nullable(),
  wavePeriod: z.number().nullable(),
  waveDirection: z.number().nullable(),
  windSpeedKmh: z.number().nullable(),
  windDirection: z.number().nullable(),
  windCondition: z
    .enum(["onshore", "cross-onshore", "cross-shore", "cross-offshore", "offshore"])
    .nullable(),
});

export const ForecastResponseSchema = z.object({
  spot: SpotSchema,
  forecast: z.array(ForecastHourSchema),
});

export const ForecastErrorSchema = z.object({
  error: z.string(),
});

export type ForecastError = z.infer<typeof ForecastErrorSchema>;
export type ForecastHour = z.infer<typeof ForecastHourSchema>;
export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;
