import type { ForecastHour, Spot } from "@surf-window/contracts";

const DAYTIME_START_HOUR = 6;
const DAYTIME_END_HOUR = 18;
const DAILY_RECOMMENDATION_LIMIT = 5;

export type DailyBestForecast = {
  date: string;
  forecast: ForecastHour;
};

export type SpotDailyBest = {
  spot: Spot;
  date: string;
  forecast: ForecastHour;
};

export type DailyOutlook = {
  date: string;
  recommendations: SpotDailyBest[];
};

export function getBestForecastByDay(forecast: ForecastHour[]): DailyBestForecast[] {
  const bestByDay = new Map<string, ForecastHour>();

  for (const item of forecast) {
    const date = item.time.slice(0, 10);
    const hour = new Date(`${item.time}Z`).getUTCHours();

    // Only consider practical daytime surf windows for the outlook.
    if (hour < DAYTIME_START_HOUR || hour > DAYTIME_END_HOUR) {
      continue;
    }

    const currentBest = bestByDay.get(date);

    // Keep only the highest-scoring forecast hour for each day.
    if (!currentBest || item.surfScore > currentBest.surfScore) {
      bestByDay.set(date, item);
    }
  }

  return Array.from(bestByDay.entries()).map(([date, forecast]) => ({
    date,
    forecast,
  }));
}

export function rankSpotDailyForecasts(forecasts: SpotDailyBest[]): SpotDailyBest[] {
  // Sort a copy so callers keep their original forecast order.
  return [...forecasts].sort((a, b) => b.forecast.surfScore - a.forecast.surfScore);
}

export function deduplicateSpotDailyForecasts(forecasts: SpotDailyBest[]): SpotDailyBest[] {
  const seen = new Set<string>();

  return forecasts.filter((item) => {
    // Collapse equivalent recommendations only within the same region.
    const key = [
      item.spot.region,
      item.date,
      item.forecast.time,
      item.forecast.surfScore,
      item.forecast.waveHeight,
      item.forecast.swellPeriod,
      item.forecast.windCondition,
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

export function getDailyOutlook(forecasts: SpotDailyBest[]): DailyOutlook[] {
  const forecastsByDate = new Map<string, SpotDailyBest[]>();

  for (const item of forecasts) {
    const existing = forecastsByDate.get(item.date) ?? [];

    existing.push(item);
    forecastsByDate.set(item.date, existing);
  }

  return Array.from(forecastsByDate.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, dailyForecasts]) => {
      const ranked = rankSpotDailyForecasts(dailyForecasts);
      const deduplicated = deduplicateSpotDailyForecasts(ranked);

      const worthwhile = deduplicated.filter((item) => item.forecast.surfScore >= 50);

      return {
        date,
        recommendations: worthwhile.slice(0, DAILY_RECOMMENDATION_LIMIT),
      };
    });
}
