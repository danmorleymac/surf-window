import type { FastifyInstance } from "fastify";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { buildApp } from "../app.js";
import { fetchMarineForecast } from "../clients/open-meteo-client.js";
import { getSpotById } from "../db/queries/spots.js";
import { marineForecast } from "../test/fixtures/marine-forecast.js";
import { croydeSpot } from "../test/fixtures/spots.js";

vi.mock("../clients/open-meteo-client.js", () => ({
  fetchMarineForecast: vi.fn(),
}));

vi.mock("../db/queries/spots.js", () => ({
  getSpotById: vi.fn(),
}));

const mockedFetchMarineForecast = vi.mocked(fetchMarineForecast);
const mockedGetSpotById = vi.mocked(getSpotById);

describe("GET /api/spots/:spotId/forecast", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
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

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(200);

    expect(mockedGetSpotById).toHaveBeenCalledWith("croyde");

    expect(mockedFetchMarineForecast).toHaveBeenCalledWith(
      croydeSpot.latitude,
      croydeSpot.longitude,
    );

    expect(response.json()).toEqual({
      spot: croydeSpot,
      forecast: [
        {
          time: "2026-08-16T12:00",
          waveHeight: 1.2,
          wavePeriod: 9,
          waveDirection: 275,
        },
        {
          time: "2026-08-16T13:00",
          waveHeight: 1.3,
          wavePeriod: 9.5,
          waveDirection: 280,
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
  });

  it("returns 502 when the marine forecast cannot be retrieved", async () => {
    mockedGetSpotById.mockResolvedValue(croydeSpot);

    mockedFetchMarineForecast.mockRejectedValue(
      new Error("Open-Meteo unavailable"),
    );

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(502);

    expect(response.json()).toEqual({
      error: "Unable to retrieve marine forecast",
    });
  });
});