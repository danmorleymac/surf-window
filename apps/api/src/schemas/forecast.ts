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

export const OpenMeteoWeatherResponseSchema = z.object({
  hourly: z.object({
    time: z.array(z.string()),
    wind_speed_10m: z.array(z.number().nullable()),
    wind_direction_10m: z.array(z.number().nullable()),
  }),
});

export const ForecastHourSchema = z.object({
  time: z.string(),
  waveHeight: z.number().nullable(),
  wavePeriod: z.number().nullable(),
  waveDirection: z.number().nullable(),
  windSpeedKmh: z.number().nullable(),
  windDirection: z.number().nullable(),
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

export type OpenMeteoMarineResponse = z.infer<typeof OpenMeteoMarineResponseSchema>;
export type OpenMeteoWeatherResponse = z.infer<typeof OpenMeteoWeatherResponseSchema>;
