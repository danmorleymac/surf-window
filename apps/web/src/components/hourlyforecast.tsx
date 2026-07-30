import type { ForecastHour } from "../schemas/forecast";

type HourlyForecastProps = {
  forecast: ForecastHour[];
};

export function HourlyForecast({
  forecast,
}: HourlyForecastProps) {
  if (forecast.length === 0) {
    return <p>No more forecast data for today.</p>;
  }

  return (
    <section>
      <h3>Rest of today</h3>

      <ul>
        {forecast.map((item) => (
          <li key={item.time}>
            <strong>
              {new Date(item.time).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
            {" — "}
            {item.waveHeight ?? "Unknown"} m,{" "}
            {item.wavePeriod ?? "Unknown"} s,{" "}
            {item.waveDirection ?? "Unknown"}°
          </li>
        ))}
      </ul>
    </section>
  );
}