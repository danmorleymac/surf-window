import type { ForecastResponse } from "@surf-window/contracts";

import { fetchMarineForecast } from "../clients/open-meteo-marine-client.js";
import { fetchWeatherForecast } from "../clients/open-meteo-weather-client.js";
import { getTidalEvents } from "../clients/ukho-tidal-client.js";
import type { SurfSpot } from "../db/schema.js";
import { getTideState } from "../domain/tide-state.js";
import { getWindCondition } from "../domain/wind-condition.js";
import { ForecastServiceError } from "../errors/forecast-service-error.js";

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

    // Wind data is optional. A weather API failure should not prevent the forecast from being returned.
    try {
      const weatherData = await fetchWeatherForecast(spot.latitude, spot.longitude);

      // Map weather data by time so it can be joined to each marine forecast hour.
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

    let tidalEvents: Awaited<ReturnType<typeof getTidalEvents>> = [];

    // Tide data is optional. A UKHO failure should not prevent the forecast from being returned.
    try {
      tidalEvents = await getTidalEvents(spot.tidalStationId);
    } catch (error) {
      console.error("UKHO tide request failed:", error);
    }

    try {
      tidalEvents = await getTidalEvents(spot.tidalStationId);
    } catch (error) {
      console.error("UKHO tide request failed:", error);
    }

    const tideEvents = tidalEvents
      .filter((event): event is typeof event & { DateTime: string } => event.DateTime !== undefined)
      .map((event) => ({
        type: event.EventType === "HighWater" ? ("high" as const) : ("low" as const),
        time: event.DateTime,
        height: event.Height ?? null,
      }));

    const forecast = marineData.hourly.time.map((time, index) => {
      const wind = weatherByTime.get(time);
      const windDirection = wind?.windDirection ?? null;

      const tideState =
        tidalEvents.length === 0 ? null : getTideState(new Date(`${time}Z`), tidalEvents);

      return {
        time,
        secondarySwellHeight: marineData.hourly.secondary_swell_wave_height[index] ?? null,
        secondarySwellPeriod: marineData.hourly.secondary_swell_wave_period[index] ?? null,
        secondarySwellDirection: marineData.hourly.secondary_swell_wave_direction[index] ?? null,
        swellHeight: marineData.hourly.swell_wave_height[index] ?? null,
        swellPeriod: marineData.hourly.swell_wave_period[index] ?? null,
        swellDirection: marineData.hourly.swell_wave_direction[index] ?? null,
        waveHeight: marineData.hourly.wave_height[index] ?? null,
        wavePeriod: marineData.hourly.wave_period[index] ?? null,
        waveDirection: marineData.hourly.wave_direction[index] ?? null,
        windSpeedKmh: wind?.windSpeedKmh ?? null,
        windDirection,
        windCondition:
          windDirection === null ? null : getWindCondition(windDirection, spot.shoreBearing),
        tideState,
      };
    });

    return {
      spot,
      forecast,
      tideEvents,
    };
  } catch (error) {
    console.error("Forecast service failed:", error);
    throw new ForecastServiceError();
  }
}
