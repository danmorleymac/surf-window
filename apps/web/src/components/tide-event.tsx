// components/tide-events.tsx
import type { TideEvent } from "@surf-window/contracts";

type TideEventsProps = {
  events: TideEvent[];
};

export function TideEvents({ events }: TideEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section>
      <h3>Tides</h3>

      <ul>
        {events.map((event) => (
          <li key={`${event.type}-${event.time}`}>
            {event.type === "high" ? "High" : "Low"}{" "}
            {new Date(`${event.time}Z`).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {event.height !== null && ` — ${event.height.toFixed(1)} m`}
          </li>
        ))}
      </ul>
    </section>
  );
}
