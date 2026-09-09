import { useQuery } from "@tanstack/react-query";

import { getNextForecast, getRemainingForecastsToday } from "../lib/forecast";
import { forecastQueryOptions } from "../query-options/forecast";
import { HourlyForecast } from "./hourly-forecast";
import { TideEvents } from "./tide-event";

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

  const currentDay = new Date(`${currentForecast?.time}Z`).toISOString().slice(0, 10);

  const todaysTideEvents = data.tideEvents.filter(
    (event) => event.time.slice(0, 10) === currentDay
  );

  const remainingForecasts = getRemainingForecastsToday(data.forecast, 2);

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

        <p>Direction: {currentForecast.waveDirection ?? "Unknown"}°</p>
        <p>
          Primary swell:{" "}
          {currentForecast.swellHeight !== null &&
          currentForecast.swellPeriod !== null &&
          currentForecast.swellDirection !== null
            ? `${currentForecast.swellHeight} m @ ${currentForecast.swellPeriod} s · ${currentForecast.swellDirection}°`
            : "Unknown"}
        </p>

        {currentForecast.secondarySwellHeight !== null &&
          currentForecast.secondarySwellPeriod !== null &&
          currentForecast.secondarySwellDirection !== null && (
            <p>
              Secondary swell: {currentForecast.secondarySwellHeight} m @{" "}
              {currentForecast.secondarySwellPeriod} s · {currentForecast.secondarySwellDirection}°
            </p>
          )}

        <p>Wind: {currentForecast.windSpeedKmh ?? "Unknown"} km/h</p>

        <p>Wind direction: {currentForecast.windDirection ?? "Unknown"}°</p>

        <p>Wind condition: {currentForecast.windCondition ?? "Unknown"}</p>
        <p>Tide: {currentForecast.tideState ?? "Unknown"}</p>
      </section>
      <TideEvents events={todaysTideEvents} />
      <HourlyForecast forecast={remainingForecasts} />
    </>
  );
}
