import { env } from "../config/env.js";
import { OpenMeteoWeatherResponseSchema } from "../schemas/open-meteo.js";

export async function fetchWeatherForecast(latitude: number, longitude: number) {
  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: ["wind_speed_10m", "wind_direction_10m"].join(","),
    timezone: "GMT",
    forecast_days: "7",
  });

  const response = await fetch(`${env.OPEN_METEO_WEATHER_BASE_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo weather request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return OpenMeteoWeatherResponseSchema.parse(data);
}
