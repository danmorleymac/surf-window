// src/test/fixtures/marine-forecast.ts
import type { OpenMeteoMarineResponse } from "../../schemas/open-meteo.js";

export const marineForecast: OpenMeteoMarineResponse = {
  hourly: {
    time: ["2026-08-16T12:00", "2026-08-16T13:00"],
    wave_height: [1.2, 1.3],
    wave_period: [9, 9.5],
    wave_direction: [275, 280],
  },
};
