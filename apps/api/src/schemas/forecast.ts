// src/schemas/forecast.ts

import { z } from "zod";

export const OpenMeteoMarineResponseSchema = z.object({
  hourly: z.object({
    time: z.array(z.string()),
    wave_height: z.array(z.number().nullable()),
    wave_period: z.array(z.number().nullable()),
    wave_direction: z.array(z.number().nullable()),
  }),
});

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

export const ForecastErrorSchema = z.object({
  error: z.string(),
});

export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;
export type ForecastError = z.infer<typeof ForecastErrorSchema>;
