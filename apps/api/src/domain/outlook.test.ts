import type { ForecastHour } from "@surf-window/contracts";
import { describe, expect, it } from "vitest";

import {
  deduplicateSpotDailyForecasts,
  getBestForecastByDay,
  getDailyOutlook,
  rankSpotDailyForecasts,
  type SpotDailyBest,
} from "./outlook.js";

function createForecastHour(time: string, surfScore: number): ForecastHour {
  return {
    time,
    waveHeight: 1,
    wavePeriod: 8,
    waveDirection: 270,
    swellHeight: 1,
    swellPeriod: 8,
    swellDirection: 270,
    secondarySwellHeight: null,
    secondarySwellPeriod: null,
    secondarySwellDirection: null,
    windWaveHeight: 1,
    windWavePeriod: 8,
    windWaveDirection: 270,
    windSpeedKmh: 10,
    windDirection: 270,
    windCondition: "offshore",
    tideState: null,
    surfScore,
    surfRating: surfScore >= 80 ? "excellent" : surfScore >= 65 ? "good" : "fair",
  };
}

describe("outlook", () => {
  it("returns the highest scoring daytime forecast for each day", () => {
    const forecast = [
      createForecastHour("2026-10-20T06:00", 60),
      createForecastHour("2026-10-20T09:00", 75),
      createForecastHour("2026-10-20T12:00", 68),
      createForecastHour("2026-10-21T06:00", 55),
      createForecastHour("2026-10-21T12:00", 70),
    ];

    const result = getBestForecastByDay(forecast);

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      date: "2026-10-20",
      forecast: {
        time: "2026-10-20T09:00",
        surfScore: 75,
      },
    });

    expect(result[1]).toMatchObject({
      date: "2026-10-21",
      forecast: {
        time: "2026-10-21T12:00",
        surfScore: 70,
      },
    });
  });

  it("ignores forecasts outside daytime hours", () => {
    const forecast = [
      createForecastHour("2026-10-20T03:00", 95),
      createForecastHour("2026-10-20T09:00", 70),
      createForecastHour("2026-10-20T21:00", 90),
    ];

    const result = getBestForecastByDay(forecast);

    expect(result[0].forecast.time).toBe("2026-10-20T09:00");
  });

  it("ranks spot/day forecasts by surf score", () => {
    const forecasts: SpotDailyBest[] = [
      {
        spot: {
          id: "croyde",
          name: "Croyde",
          region: "North Devon",
          latitude: 51.13,
          longitude: -4.24,
        },
        date: "2026-10-20",
        forecast: createForecastHour("2026-10-20T09:00", 68),
      },
      {
        spot: {
          id: "cromer",
          name: "Cromer",
          region: "Norfolk",
          latitude: 52.93,
          longitude: 1.3,
        },
        date: "2026-10-20",
        forecast: createForecastHour("2026-10-20T12:00", 82),
      },
    ];

    const result = rankSpotDailyForecasts(forecasts);

    expect(result.map((item) => item.spot.id)).toEqual(["cromer", "croyde"]);
  });

  it("groups recommendations by day and ranks each day", () => {
    const forecasts: SpotDailyBest[] = [
      {
        spot: {
          id: "croyde",
          name: "Croyde",
          region: "North Devon",
          latitude: 51.13,
          longitude: -4.24,
        },
        date: "2026-10-26",
        forecast: createForecastHour("2026-10-26T09:00", 70),
      },
      {
        spot: {
          id: "cromer",
          name: "Cromer",
          region: "Norfolk",
          latitude: 52.93,
          longitude: 1.3,
        },
        date: "2026-10-26",
        forecast: createForecastHour("2026-10-26T12:00", 85),
      },
      {
        spot: {
          id: "joss-bay",
          name: "Joss Bay",
          region: "Kent",
          latitude: 51.38,
          longitude: 1.45,
        },
        date: "2026-10-27",
        forecast: createForecastHour("2026-10-27T12:00", 75),
      },
    ];

    const result = getDailyOutlook(forecasts);

    expect(result).toHaveLength(2);

    expect(result[0].date).toBe("2026-10-26");
    expect(result[0].recommendations.map((item) => item.spot.id)).toEqual(["cromer", "croyde"]);

    expect(result[1].date).toBe("2026-10-27");
    expect(result[1].recommendations.map((item) => item.spot.id)).toEqual(["joss-bay"]);
  });

  it("returns days in date order", () => {
    const forecasts: SpotDailyBest[] = [
      {
        spot: {
          id: "croyde",
          name: "Croyde",
          region: "North Devon",
          latitude: 51.13,
          longitude: -4.24,
        },
        date: "2026-10-28",
        forecast: createForecastHour("2026-10-28T09:00", 70),
      },
      {
        spot: {
          id: "cromer",
          name: "Cromer",
          region: "Norfolk",
          latitude: 52.93,
          longitude: 1.3,
        },
        date: "2026-10-26",
        forecast: createForecastHour("2026-10-26T12:00", 80),
      },
    ];

    const result = getDailyOutlook(forecasts);

    expect(result.map((day) => day.date)).toEqual(["2026-10-26", "2026-10-28"]);
  });

  it("deduplicates equivalent recommendations within the same region", () => {
    const forecast = createForecastHour("2026-10-26T12:00", 80);

    const forecasts: SpotDailyBest[] = [
      {
        spot: {
          id: "bournemouth-pier",
          name: "Bournemouth Pier",
          region: "Dorset",
          latitude: 50.72,
          longitude: -1.88,
        },
        date: "2026-10-26",
        forecast,
      },
      {
        spot: {
          id: "boscombe",
          name: "Boscombe",
          region: "Dorset",
          latitude: 50.72,
          longitude: -1.84,
        },
        date: "2026-10-26",
        forecast,
      },
    ];

    const result = deduplicateSpotDailyForecasts(forecasts);

    expect(result).toHaveLength(1);
    expect(result[0].spot.id).toBe("bournemouth-pier");
  });
});
