export type TideState = "rising" | "falling";

type TideEvent = {
  EventType: "HighWater" | "LowWater";
  DateTime?: string;
};

export function getTideState(forecastTime: Date, events: TideEvent[]): TideState | null {
  const validEvents = events
    .filter((event): event is TideEvent & { DateTime: string } => event.DateTime !== undefined)
    .map((event) => ({
      ...event,

      // UKHO Discovery event timestamps are supplied in GMT.
      time: new Date(`${event.DateTime}Z`),
    }))
    .sort((a, b) => a.time.getTime() - b.time.getTime());

  const previousEvent = validEvents.filter((event) => event.time <= forecastTime).at(-1);

  const nextEvent = validEvents.find((event) => event.time > forecastTime);

  if (!previousEvent || !nextEvent) {
    return null;
  }

  if (previousEvent.EventType === "LowWater" && nextEvent.EventType === "HighWater") {
    return "rising";
  }

  if (previousEvent.EventType === "HighWater" && nextEvent.EventType === "LowWater") {
    return "falling";
  }

  return null;
}
