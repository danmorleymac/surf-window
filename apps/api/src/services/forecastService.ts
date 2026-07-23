// src/services/forecast-service.ts

import { fetchMarineForecast } from "../clients/open-meteo-client.js";
import { CroydeSpot } from "../data/spots.js";
import type { ForecastResponse } from "../schemas/forecast.js";

export async function getCroydeForecast(): Promise<ForecastResponse> {
  const marineData = await fetchMarineForecast(CroydeSpot.latitude, CroydeSpot.longitude);

  const forecast = marineData.hourly.time.map((time, index) => ({
    time,
    waveHeight: marineData.hourly.wave_height[index] ?? null,
    wavePeriod: marineData.hourly.wave_period[index] ?? null,
    waveDirection: marineData.hourly.wave_direction[index] ?? null,
  }));

  return {
    spot: CroydeSpot,
    forecast,
  };
}
