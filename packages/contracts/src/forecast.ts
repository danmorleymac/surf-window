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

export const ForecastErrorSchema = z.object({
  error: z.string(),
});

export const TideEventSchema = z.object({
  type: z.enum(["high", "low"]),
  time: z.string(),
  height: z.number().nullable(),
});

export const ForecastResponseSchema = z.object({
  spot: SpotSchema,
  forecast: z.array(ForecastHourSchema),
  tideEvents: z.array(TideEventSchema),
});

export type ForecastError = z.infer<typeof ForecastErrorSchema>;
export type ForecastHour = z.infer<typeof ForecastHourSchema>;
export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;
export type TideEvent = z.infer<typeof TideEventSchema>;
