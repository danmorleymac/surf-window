import type { OutlookRecommendation, OutlookResponse } from "@surf-window/contracts";

import { getAllSpots } from "../db/queries/spots.js";
import {
  getBestForecastByDay,
  getBestOfWeek,
  getUpcomingWeekendDates,
  getWeekendOutlook,
  type SpotDailyBest,
} from "../domain/outlook.js";
import { getForecastForSpot } from "./forecast-service.js";

const WEEKEND_RECOMMENDATION_LIMIT = 5;

function toOutlookRecommendation(item: SpotDailyBest): OutlookRecommendation {
  return {
    spot: {
      id: item.spot.id,
      name: item.spot.name,
      latitude: item.spot.latitude,
      longitude: item.spot.longitude,
      region: item.spot.region,
    },
    date: item.date,
    bestTime: item.forecast.time,
    surfScore: item.forecast.surfScore,
    surfRating: item.forecast.surfRating,
    waveHeight: item.forecast.waveHeight,
    swellPeriod: item.forecast.swellPeriod,
    windCondition: item.forecast.windCondition,
  };
}

export async function getOutlook(): Promise<OutlookResponse> {
  const spots = await getAllSpots();

  // A failed provider request for one spot should not prevent the outlook from returning other spots.
  const forecastResults = await Promise.allSettled(
    spots.map(async (spot) => ({
      spot,
      response: await getForecastForSpot(spot),
    }))
  );

  const forecastsBySpot = forecastResults.flatMap((result) => {
    if (result.status === "rejected") {
      console.error("Unable to load spot forecast for outlook:", result.reason);

      return [];
    }

    return [result.value];
  });

  const dailyForecasts: SpotDailyBest[] = forecastsBySpot.flatMap(({ spot, response }) =>
    getBestForecastByDay(response.forecast).map(({ date, forecast }) => ({
      spot,
      date,
      forecast,
    }))
  );

  const weekendDates = getUpcomingWeekendDates(new Date());

  const weekend = getWeekendOutlook(dailyForecasts, weekendDates);

  const bestOfWeek = getBestOfWeek(dailyForecasts);

  return {
    weekend: [
      {
        date: weekendDates.saturday,
        recommendations: weekend.saturday
          .slice(0, WEEKEND_RECOMMENDATION_LIMIT)
          .map(toOutlookRecommendation),
      },
      {
        date: weekendDates.sunday,
        recommendations: weekend.sunday
          .slice(0, WEEKEND_RECOMMENDATION_LIMIT)
          .map(toOutlookRecommendation),
      },
    ],
    bestOfWeek: bestOfWeek.map(toOutlookRecommendation),
  };
}
