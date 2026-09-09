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
