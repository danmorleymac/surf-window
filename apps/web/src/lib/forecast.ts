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


export function getRemainingForecastsToday(
    forecast: ForecastHour[],
    now = new Date(),
  ): ForecastHour[] {
    return forecast.filter((item) => {
      const forecastTime = new Date(item.time);
  
      return (
        forecastTime.getTime() >= now.getTime() &&
        forecastTime.getFullYear() === now.getFullYear() &&
        forecastTime.getMonth() === now.getMonth() &&
        forecastTime.getDate() === now.getDate()
      );
    });
  }