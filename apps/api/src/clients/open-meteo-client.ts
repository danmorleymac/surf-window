import { OpenMeteoMarineResponseSchema } from "../schemas/forecast.js";

const OPEN_METEO_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";

export async function fetchMarineForecast(latitude: number, longitude: number) {
  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: ["wave_height", "wave_period", "wave_direction"].join(","),
    timezone: "Europe/London",
    forecast_days: "7",
  });

  const response = await fetch(`${OPEN_METEO_MARINE_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return OpenMeteoMarineResponseSchema.parse(data);
}
