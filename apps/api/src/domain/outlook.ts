import type { ForecastHour, Spot } from "@surf-window/contracts";

const DAYTIME_START_HOUR = 6;
const DAYTIME_END_HOUR = 18;

export type DailyBestForecast = {
  date: string;
  forecast: ForecastHour;
};

export type SpotDailyBest = {
  spot: Spot;
  date: string;
  forecast: ForecastHour;
};

export type WeekendDates = {
  saturday: string;
  sunday: string;
};

export type WeekendOutlook = {
  saturday: SpotDailyBest[];
  sunday: SpotDailyBest[];
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

export function getUpcomingWeekendDates(referenceDate: Date): WeekendDates {
  const day = referenceDate.getUTCDay();
  const daysUntilSaturday = (6 - day + 7) % 7;

  const saturday = new Date(referenceDate);
  saturday.setUTCDate(referenceDate.getUTCDate() + daysUntilSaturday);

  const sunday = new Date(saturday);
  sunday.setUTCDate(saturday.getUTCDate() + 1);

  return {
    saturday: saturday.toISOString().slice(0, 10),
    sunday: sunday.toISOString().slice(0, 10),
  };
}

export function getWeekendOutlook(
  forecasts: SpotDailyBest[],
  weekendDates: WeekendDates
): WeekendOutlook {
  const saturday = forecasts.filter((item) => item.date === weekendDates.saturday);

  const sunday = forecasts.filter((item) => item.date === weekendDates.sunday);

  return {
    saturday: deduplicateSpotDailyForecasts(rankSpotDailyForecasts(saturday)),
    sunday: deduplicateSpotDailyForecasts(rankSpotDailyForecasts(sunday)),
  };
}

export function getBestOfWeek(forecasts: SpotDailyBest[], limit = 5): SpotDailyBest[] {
  const ranked = rankSpotDailyForecasts(forecasts);
  const deduplicated = deduplicateSpotDailyForecasts(ranked);

  return deduplicated.slice(0, limit);
}
