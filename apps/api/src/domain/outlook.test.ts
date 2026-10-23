import type { ForecastHour } from "@surf-window/contracts";
import { describe, expect, it } from "vitest";

import {
  getBestForecastByDay,
  getBestOfWeek,
  getUpcomingWeekendDates,
  getWeekendOutlook,
  rankSpotDailyForecasts,
  SpotDailyBest,
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
    windSpeedKmh: 10,
    windDirection: 270,
    windCondition: "offshore",
    tideState: null,
    surfScore,
    surfRating: surfScore >= 65 ? "good" : "fair",
    windWaveHeight: 1,
    windWavePeriod: 8,
    windWaveDirection: 270,
  };
}

describe("getBestForecastByDay", () => {
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

  it("returns the upcoming Saturday and Sunday", () => {
    const result = getUpcomingWeekendDates(new Date("2026-10-19T12:00:00Z"));

    expect(result).toEqual({
      saturday: "2026-10-24",
      sunday: "2026-10-25",
    });
  });

  it("returns ranked Saturday and Sunday forecasts", () => {
    const forecasts: SpotDailyBest[] = [
      {
        spot: {
          id: "croyde",
          name: "Croyde",
          region: "North Devon",
          latitude: 51.13,
          longitude: -4.24,
        },
        date: "2026-10-24",
        forecast: createForecastHour("2026-10-24T09:00", 70),
      },
      {
        spot: {
          id: "cromer",
          name: "Cromer",
          region: "Norfolk",
          latitude: 52.93,
          longitude: 1.3,
        },
        date: "2026-10-24",
        forecast: createForecastHour("2026-10-24T12:00", 80),
      },
      {
        spot: {
          id: "joss-bay",
          name: "Joss Bay",
          region: "Kent",
          latitude: 51.38,
          longitude: 1.45,
        },
        date: "2026-10-25",
        forecast: createForecastHour("2026-10-25T12:00", 65),
      },
    ];

    const result = getWeekendOutlook(forecasts, {
      saturday: "2026-10-24",
      sunday: "2026-10-25",
    });

    expect(result.saturday.map((item: SpotDailyBest) => item.spot.id)).toEqual([
      "cromer",
      "croyde",
    ]);

    expect(result.sunday.map((item: SpotDailyBest) => item.spot.id)).toEqual(["joss-bay"]);
  });

  it("returns the highest scoring spot/day forecasts", () => {
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
        forecast: createForecastHour("2026-10-20T09:00", 70),
      },
      {
        spot: {
          id: "cromer",
          name: "Cromer",
          region: "Norfolk",
          latitude: 52.93,
          longitude: 1.3,
        },
        date: "2026-10-21",
        forecast: createForecastHour("2026-10-21T12:00", 82),
      },
      {
        spot: {
          id: "joss-bay",
          name: "Joss Bay",
          region: "Kent",
          latitude: 51.38,
          longitude: 1.45,
        },
        date: "2026-10-22",
        forecast: createForecastHour("2026-10-22T12:00", 65),
      },
    ];

    const result = getBestOfWeek(forecasts, 2);

    expect(result.map((item: SpotDailyBest) => item.spot.id)).toEqual(["cromer", "croyde"]);
  });
});
