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

vi.mock("../clients/open-meteo-client.js", () => ({
  fetchMarineForecast: vi.fn(),
}));

const mockedFetchMarineForecast = vi.mocked(fetchMarineForecast);

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

  it("returns 404 for an unknown surf spot", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/spots/banana/forecast",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "Unknown surf spot: banana",
    });
  });

  it("returns a forecast for Croyde", async () => {
    mockedFetchMarineForecast.mockResolvedValue({
      hourly: {
        time: [
          "2026-08-06T12:00",
          "2026-08-06T13:00",
        ],
        wave_height: [1.2, 1.3],
        wave_period: [9, 9.5],
        wave_direction: [275, 280],
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/spots/croyde/forecast",
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toEqual({
      spot: {
        id: "croyde",
        name: "Croyde",
        latitude: 51.13,
        longitude: -4.24,
      },
      forecast: [
        {
          time: "2026-08-06T12:00",
          waveHeight: 1.2,
          wavePeriod: 9,
          waveDirection: 275,
        },
        {
          time: "2026-08-06T13:00",
          waveHeight: 1.3,
          wavePeriod: 9.5,
          waveDirection: 280,
        },
      ],
    });

    expect(mockedFetchMarineForecast).toHaveBeenCalledOnce();
    expect(mockedFetchMarineForecast).toHaveBeenCalledWith(
      51.13,
      -4.24,
    );
  });
});