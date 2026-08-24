import { fetchMarineForecast } from "../clients/open-meteo-marine-client.js";
import { fetchWeatherForecast } from "../clients/open-meteo-weather-client.js";
import type { SurfSpot } from "../db/schema.js";
import { ForecastServiceError } from "../errors/forecast-service-error.js";
import type { ForecastResponse } from "@surf-window/contracts";

export async function getForecastForSpot(spot: SurfSpot): Promise<ForecastResponse> {
  try {
    const marineData = await fetchMarineForecast(spot.latitude, spot.longitude);

    let weatherByTime = new Map<
      string,
      {
        windSpeedKmh: number | null;
        windDirection: number | null;
      }
    >();

    //  Wind data is optional. A weather API failure should not prevent the forecast from being returned.
    try {
      const weatherData = await fetchWeatherForecast(spot.latitude, spot.longitude);

      // Map the weather data by time to get the wind speed and direction for each hour
      weatherByTime = new Map(
        weatherData.hourly.time.map((time, index) => [
          time,
          {
            windSpeedKmh: weatherData.hourly.wind_speed_10m[index] ?? null,
            windDirection: weatherData.hourly.wind_direction_10m[index] ?? null,
          },
        ])
      );
    } catch {
      // Weather enriches the forecast, but is not required.
    }

    const forecast = marineData.hourly.time.map((time, index) => {
      const wind = weatherByTime.get(time);

      return {
        time,
        waveHeight: marineData.hourly.wave_height[index] ?? null,
        wavePeriod: marineData.hourly.wave_period[index] ?? null,
        waveDirection: marineData.hourly.wave_direction[index] ?? null,
        windSpeedKmh: wind?.windSpeedKmh ?? null,
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
