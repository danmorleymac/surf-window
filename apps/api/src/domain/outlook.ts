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

export type WeekendOutlook = {
  saturday: SpotDailyBest[];
  sunday: SpotDailyBest[];
};

export function getWeekendOutlook(forecasts: SpotDailyBest[]): WeekendOutlook {
  const saturday: SpotDailyBest[] = [];
  const sunday: SpotDailyBest[] = [];

  for (const item of forecasts) {
    const day = new Date(`${item.date}T00:00:00Z`).getUTCDay();

    if (day === 6) {
      saturday.push(item);
    }

    if (day === 0) {
      sunday.push(item);
    }
  }

  return {
    saturday: rankSpotDailyForecasts(saturday),
    sunday: rankSpotDailyForecasts(sunday),
  };
}

export function getBestOfWeek(forecasts: SpotDailyBest[], limit = 5): SpotDailyBest[] {
  return rankSpotDailyForecasts(forecasts).slice(0, limit);
}
