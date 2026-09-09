import { env } from "../config/env.js";
import { OpenMeteoMarineResponseSchema } from "../schemas/open-meteo.js";

export async function fetchMarineForecast(latitude: number, longitude: number) {
  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: [
      "wave_height",
      "wave_period",
      "wave_direction",
      "swell_wave_height",
      "swell_wave_period",
      "swell_wave_direction",
      "secondary_swell_wave_height",
      "secondary_swell_wave_period",
      "secondary_swell_wave_direction",
    ].join(","),
    timezone: "GMT",
    forecast_days: "7",
  });

  const response = await fetch(`${env.OPEN_METEO_MARINE_BASE_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return OpenMeteoMarineResponseSchema.parse(data);
}
