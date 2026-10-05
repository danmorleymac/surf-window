import { useQuery } from "@tanstack/react-query";
import { formatForecastDay, getNextForecast, groupForecastByDay } from "../lib/forecast";
import { forecastQueryOptions } from "../query-options/forecast";
import { ForecastDay } from "./forecast-day";
import { TideSummary } from "./tide-summary";

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

  if (!currentForecast) {
    return <p>No upcoming forecast available.</p>;
  }

  const forecastByDay = groupForecastByDay(data.forecast);

  const currentDay = currentForecast.time.slice(0, 10);

  const todaysTideEvents = data.tideEvents.filter(
    (event) => event.time.slice(0, 10) === currentDay
  );

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

      <TideSummary events={todaysTideEvents} />

      {Object.entries(forecastByDay).map(([date, forecast]) => {
        const tideEvents = data.tideEvents.filter((event) => event.time.slice(0, 10) === date);

        return (
          <ForecastDay
            key={date}
            forecast={forecast}
            tideEvents={tideEvents}
            title={formatForecastDay(date)}
          />
        );
      })}
    </>
  );
}
