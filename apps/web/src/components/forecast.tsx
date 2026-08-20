import { useQuery } from "@tanstack/react-query";

import { getNextForecast, getRemainingForecastsToday } from "../lib/forecast";
import { forecastQueryOptions } from "../query-options/forecast";
import { HourlyForecast } from "./hourly-forecast";

type ForecastProps = {
  spotId: string;
};

export function Forecast({ spotId }: ForecastProps) {
  const { data, error, isPending, isFetching, refetch } = useQuery(forecastQueryOptions(spotId));

  if (isPending) {
    return <p>Loading forecast...</p>;
  }

  if (error) {
    return (
      <section>
        <p>{error instanceof Error ? error.message : "Unable to load forecast"}</p>

        <button type="button" onClick={() => void refetch()}>
          Try again
        </button>
      </section>
    );
  }

  const currentForecast = getNextForecast(data.forecast);
  const remainingForecasts = getRemainingForecastsToday(data.forecast);

  if (!currentForecast) {
    return <p>No upcoming forecast available.</p>;
  }

  return (
    <>
      <section>
        <h2>{data.spot.name}</h2>

        {isFetching && <p>Refreshing...</p>}

        <p>
          Forecast for{" "}
          {new Date(currentForecast.time).toLocaleString("en-GB", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <p>Wave height: {currentForecast.waveHeight ?? "Unknown"} m</p>

        <p>Wave period: {currentForecast.wavePeriod ?? "Unknown"} s</p>

        <p>Direction: {currentForecast.waveDirection ?? "Unknown"}°</p>
        <p>Wind: {currentForecast.windSpeedKmh ?? "Unknown"} km/h</p>

        <p>Wind direction: {currentForecast.windDirection ?? "Unknown"}°</p>

        <button type="button" onClick={() => void refetch()}>
          Refresh
        </button>
      </section>

      <HourlyForecast forecast={remainingForecasts} />
    </>
  );
}
