import { expect, it } from "vitest";
import { getTideState } from "./tide-state.js";

it("returns falling between high and low water", () => {
  const events = [
    {
      EventType: "HighWater" as const,
      DateTime: "2026-09-03T09:20:00",
    },
    {
      EventType: "LowWater" as const,
      DateTime: "2026-09-03T16:03:00",
    },
  ];

  expect(getTideState(new Date("2026-09-03T12:00:00Z"), events)).toBe("falling");
});

it("returns rising between low and high water", () => {
  const events = [
    {
      EventType: "LowWater" as const,
      DateTime: "2026-09-03T16:03:00",
    },
    {
      EventType: "HighWater" as const,
      DateTime: "2026-09-03T21:44:00",
    },
  ];

  expect(getTideState(new Date("2026-09-03T18:00:00Z"), events)).toBe("rising");
});

it("returns null when the forecast time is outside the available events", () => {
  const events = [
    {
      EventType: "LowWater" as const,
      DateTime: "2026-09-03T16:03:00",
    },
    {
      EventType: "HighWater" as const,
      DateTime: "2026-09-03T21:44:00",
    },
  ];

  expect(getTideState(new Date("2026-09-04T12:00:00Z"), events)).toBeNull();
});
