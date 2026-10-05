import type { ForecastHour } from "@surf-window/contracts";

export function getNextForecast(
  forecast: ForecastHour[],
  now = new Date()
): ForecastHour | undefined {
  return forecast.find((item) => {
    const forecastTime = new Date(item.time);

    return forecastTime.getTime() >= now.getTime();
  });
}

export function getRemainingForecastsToday(forecast: ForecastHour[], intervalHours = 1) {
  const now = new Date();

  return forecast
    .filter((item) => {
      const itemDate = new Date(`${item.time}Z`);

      return (
        itemDate.getUTCFullYear() === now.getUTCFullYear() &&
        itemDate.getUTCMonth() === now.getUTCMonth() &&
        itemDate.getUTCDate() === now.getUTCDate() &&
        itemDate >= now
      );
    })
    .filter((_, index) => index % intervalHours === 0);
}

export function groupForecastByDay(forecast: ForecastHour[]) {
  return forecast.reduce<Record<string, ForecastHour[]>>((days, item) => {
    const date = item.time.slice(0, 10);

    days[date] ??= [];
    days[date].push(item);

    return days;
  }, {});
}

export function formatForecastDay(date: string) {
  const today = new Date().toISOString().slice(0, 10);

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  if (date === today) {
    return "Today";
  }

  if (date === tomorrowDate) {
    return "Tomorrow";
  }

  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
