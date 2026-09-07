import type { getTidalEvents } from "../../clients/ukho-tidal-client.js";

export const tidalEvents: Awaited<ReturnType<typeof getTidalEvents>> = [
  {
    EventType: "LowWater",
    DateTime: "2026-08-16T10:00:00",
    Height: 1.2,
    IsApproximateTime: false,
    IsApproximateHeight: false,
    Filtered: false,
  },
  {
    EventType: "HighWater",
    DateTime: "2026-08-16T16:00:00",
    Height: 6.5,
    IsApproximateTime: false,
    IsApproximateHeight: false,
    Filtered: false,
  },
];
