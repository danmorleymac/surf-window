import { useEffect, useState } from "react";
import { getCroydeForecast } from "../lib/api-client";
import type { ForecastResponse } from "../schemas/forecast";

export function ForecastSummary() {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCroydeForecast()
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load forecast");
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading forecast...</p>;
  }

  const firstForecast = data.forecast[0];

  if (!firstForecast) {
    return <p>No forecast available.</p>;
  }

  return (
    <section>
      <h2>{data.spot.name}</h2>
      <p>Wave height: {firstForecast.waveHeight ?? "Unknown"} m</p>
      <p>Wave period: {firstForecast.wavePeriod ?? "Unknown"} s</p>
      <p>Direction: {firstForecast.waveDirection ?? "Unknown"}°</p>
    </section>
  );
}
