import type { OpenMeteoWeatherResponse } from "../../schemas/forecast.js";

export const weatherForecast: OpenMeteoWeatherResponse = {
  hourly: {
    time: ["2026-08-16T12:00", "2026-08-16T13:00"],
    wind_speed_10m: [18, 20],
    wind_direction_10m: [240, 245],
  },
};
