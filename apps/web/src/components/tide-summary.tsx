import type { TideEvent } from "@surf-window/contracts";

type TideSummaryProps = {
  events: TideEvent[];
};

export function TideSummary({ events }: TideSummaryProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <p>
      {events.map((event, index) => (
        <span key={`${event.type}-${event.time}`}>
          {index > 0 && "   "}
          {event.type === "high" ? "High" : "Low"}{" "}
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
