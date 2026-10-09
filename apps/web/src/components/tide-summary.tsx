import type { TideEvent } from "@surf-window/contracts";
import { usePreferences } from "../context/use-preferences";
import { formatHeight } from "../lib/units";

type TideSummaryProps = {
  events: TideEvent[];
};

export function TideSummary({ events }: TideSummaryProps) {
  const { heightUnit } = usePreferences();

  if (events.length === 0) {
    return null;
  }

  return (
    <p>
      {events.map((event, index) => (
        <span key={`${event.type}-${event.time}`}>
          {index > 0 && "   "}
          {event.type === "high" ? "High" : "Low"} {formatHeight(event.height, heightUnit)}{" "}
          {new Date(`${event.time}Z`).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          })}
        </span>
      ))}
    </p>
  );
}
