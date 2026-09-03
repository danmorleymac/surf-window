import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildApp } from "../app.js";
import { fetchMarineForecast } from "../clients/open-meteo-marine-client.js";
import { fetchWeatherForecast } from "../clients/open-meteo-weather-client.js";
import { getTidalEvents } from "../clients/ukho-tidal-client.js";
import { getSpotById } from "../db/queries/spots.js";
import { marineForecast } from "../test/fixtures/marine-forecast.js";
import { weatherForecast } from "../test/fixtures/weather-forecast.js";
import { croydeSpot } from "../test/fixtures/spots.js";

vi.mock("../clients/open-meteo-marine-client.js", () => ({
  fetchMarineForecast: vi.fn(),
}));

vi.mock("../clients/open-meteo-weather-client.js", () => ({
  fetchWeatherForecast: vi.fn(),
}));

vi.mock("../db/queries/spots.js", () => ({
  getSpotById: vi.fn(),
}));

vi.mock("../clients/ukho-tidal-client.js", () => ({
  getTidalEvents: vi.fn(),
}));

const mockedFetchMarineForecast = vi.mocked(fetchMarineForecast);
const mockedFetchWeatherForecast = vi.mocked(fetchWeatherForecast);
const mockedGetSpotById = vi.mocked(getSpotById);
const mockedGetTidalEvents = vi.mocked(getTidalEvents);

describe("GET /api/spots/:spotId/forecast", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    // Default to no tide data unless a test specifically provides it.
    mockedGetTidalEvents.mockResolvedValue([]);

    app = await buildApp({
      logger: false,
    });
  });

  afterEach(async () => {
    vi.resetAllMocks();
    await app.close();
  });

  it("returns a forecast for a known surf spot", async () => {
    mockedGetSpotById.mockResolvedValue(croydeSpot);
    mockedFetchMarineForecast.mockResolvedValue(marineForecast);
    mockedFetchWeatherForecast.mockResolvedValue(weatherForecast);

    mockedGetTidalEvents.mockResolvedValue([
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
    ]);

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(200);

    expect(mockedGetSpotById).toHaveBeenCalledWith("croyde");

    expect(mockedFetchMarineForecast).toHaveBeenCalledWith(
      croydeSpot.latitude,
      croydeSpot.longitude
    );

    expect(mockedFetchWeatherForecast).toHaveBeenCalledWith(
      croydeSpot.latitude,
      croydeSpot.longitude
    );

    expect(mockedGetTidalEvents).toHaveBeenCalledWith(croydeSpot.tidalStationId);

    expect(response.json()).toEqual({
      spot: {
        id: croydeSpot.id,
        name: croydeSpot.name,
        latitude: croydeSpot.latitude,
        longitude: croydeSpot.longitude,
      },
      forecast: [
        {
          tideState: "rising",
          time: "2026-08-16T12:00",
          waveHeight: 1.2,
          wavePeriod: 9,
          waveDirection: 275,
          windSpeedKmh: 18,
          windDirection: 240,
          windCondition: "cross-onshore",
        },
        {
          tideState: "rising",
          time: "2026-08-16T13:00",
          waveHeight: 1.3,
          wavePeriod: 9.5,
          waveDirection: 280,
          windSpeedKmh: 20,
          windDirection: 245,
          windCondition: "onshore",
        },
      ],
    });
  });

  it("returns 404 for an unknown surf spot", async () => {
    mockedGetSpotById.mockResolvedValue(undefined);

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/unknown/forecast",
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: "Unknown surf spot: unknown",
    });

    expect(mockedGetSpotById).toHaveBeenCalledWith("unknown");
    expect(mockedFetchMarineForecast).not.toHaveBeenCalled();
    expect(mockedFetchWeatherForecast).not.toHaveBeenCalled();
  });

  it("returns 502 when the marine forecast cannot be retrieved", async () => {
    mockedGetSpotById.mockResolvedValue(croydeSpot);

    mockedFetchMarineForecast.mockRejectedValue(new Error("Open-Meteo unavailable"));
    mockedFetchWeatherForecast.mockRejectedValue(new Error("Open-Meteo unavailable"));

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(502);

    expect(response.json()).toEqual({
      error: "Unable to retrieve marine forecast",
    });
  });

  it("returns the marine forecast without wind when weather cannot be retrieved", async () => {
    mockedGetSpotById.mockResolvedValue(croydeSpot);
    mockedFetchMarineForecast.mockResolvedValue(marineForecast);

    mockedFetchWeatherForecast.mockRejectedValue(new Error("Weather unavailable"));

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toEqual({
      spot: {
        id: croydeSpot.id,
        name: croydeSpot.name,
        latitude: croydeSpot.latitude,
        longitude: croydeSpot.longitude,
      },
      forecast: [
        {
          tideState: null,
          time: "2026-08-16T12:00",
          waveHeight: 1.2,
          wavePeriod: 9,
          waveDirection: 275,
          windSpeedKmh: null,
          windDirection: null,
          windCondition: null,
        },
        {
          tideState: null,
          time: "2026-08-16T13:00",
          waveHeight: 1.3,
          wavePeriod: 9.5,
          waveDirection: 280,
          windSpeedKmh: null,
          windDirection: null,
          windCondition: null,
        },
      ],
    });
  });

  it("returns the forecast without tide data when UKHO cannot be retrieved", async () => {
    mockedGetSpotById.mockResolvedValue(croydeSpot);
    mockedFetchMarineForecast.mockResolvedValue(marineForecast);
    mockedFetchWeatherForecast.mockResolvedValue(weatherForecast);

    mockedGetTidalEvents.mockRejectedValue(new Error("UKHO unavailable"));

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(200);

    expect(response.json().forecast).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tideState: null,
        }),
      ])
    );
  });
});
