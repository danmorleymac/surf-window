import type { ForecastHour } from "../schemas/forecast";

export function getNextForecast(
  forecast: ForecastHour[],
  now = new Date(),
): ForecastHour | undefined {
  return forecast.find((item) => {
    const forecastTime = new Date(item.time);

    return forecastTime.getTime() >= now.getTime();
  });
}