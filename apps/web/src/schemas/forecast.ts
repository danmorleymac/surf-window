import { z } from "zod";

export const ForecastHourSchema = z.object({
  time: z.string(),
  waveHeight: z.number().nullable(),
  wavePeriod: z.number().nullable(),
  waveDirection: z.number().nullable(),
});

export const ForecastResponseSchema = z.object({
  spot: z.object({
    id: z.string(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  forecast: z.array(ForecastHourSchema),
});

export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;
