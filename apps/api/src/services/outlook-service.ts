import type { OutlookResponse } from "@surf-window/contracts";

import { getAllSpots } from "../db/queries/spots.js";
import {
  getBestForecastByDay,
  getBestOfWeek,
  getWeekendOutlook,
  type SpotDailyBest,
} from "../domain/outlook.js";
import { getForecastForSpot } from "./forecast-service.js";

function toOutlookRecommendation(item: SpotDailyBest) {
  return {
    spot: item.spot,
    date: item.date,
    bestTime: item.forecast.time,
    surfScore: item.forecast.surfScore,
    surfRating: item.forecast.surfRating,
    waveHeight: item.forecast.waveHeight,
    swellPeriod: item.forecast.swellPeriod,
    windCondition: item.forecast.windCondition,
  };
}

export async function getOutlook() {
  const spots = await getAllSpots();

  const forecastsBySpot = await Promise.all(
    spots.map(async (spot) => ({
      spot,
      response: await getForecastForSpot(spot),
    }))
  );

  const dailyForecasts: SpotDailyBest[] = forecastsBySpot.flatMap(({ spot, response }) =>
    getBestForecastByDay(response.forecast).map(({ date, forecast }) => ({
      spot,
      date,
      forecast,
    }))
  );

  const weekend = getWeekendOutlook(dailyForecasts);
  const bestOfWeek = getBestOfWeek(dailyForecasts);

  // We'll map these to OutlookResponse next.
}
