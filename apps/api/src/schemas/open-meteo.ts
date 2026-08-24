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

export type OpenMeteoMarineResponse = z.infer<typeof OpenMeteoMarineResponseSchema>;
export type OpenMeteoWeatherResponse = z.infer<typeof OpenMeteoWeatherResponseSchema>;
