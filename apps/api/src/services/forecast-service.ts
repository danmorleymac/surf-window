import { fetchMarineForecast } from "../clients/open-meteo-marine-client.js";
import { fetchWeatherForecast } from "../clients/open-meteo-weather-client.js";
import type { SurfSpot } from "../db/schema.js";
import { ForecastServiceError } from "../errors/forecast-service-error.js";
import type { ForecastResponse } from "../schemas/forecast.js";

export async function getForecastForSpot(spot: SurfSpot): Promise<ForecastResponse> {
  try {
    const [marineData, weatherData] = await Promise.all([
      fetchMarineForecast(spot.latitude, spot.longitude),
      fetchWeatherForecast(spot.latitude, spot.longitude),
    ]);

    const weatherByTime = new Map(
      weatherData.hourly.time.map((time, index) => [
        time,
        {
          windSpeed: weatherData.hourly.wind_speed_10m[index] ?? null,
          windDirection: weatherData.hourly.wind_direction_10m[index] ?? null,
        },
      ])
    );

    const forecast = marineData.hourly.time.map((time, index) => {
      const wind = weatherByTime.get(time);

      return {
        time,
        waveHeight: marineData.hourly.wave_height[index] ?? null,
        wavePeriod: marineData.hourly.wave_period[index] ?? null,
        waveDirection: marineData.hourly.wave_direction[index] ?? null,
        windSpeed: wind?.windSpeed ?? null,
        windDirection: wind?.windDirection ?? null,
      };
    });

    return {
      spot,
      forecast,
    };
  } catch {
    throw new ForecastServiceError();
  }
}
