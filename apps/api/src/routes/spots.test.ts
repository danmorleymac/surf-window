import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildApp } from "../app.js";
import { getAllSpots } from "../db/queries/spots.js";
import { surfSpots } from "../test/fixtures/spots.js";

vi.mock("../db/queries/spots.js", () => ({
  getAllSpots: vi.fn(),
  getSpotById: vi.fn(),
}));

const mockedGetAllSpots = vi.mocked(getAllSpots);

describe("GET /api/spots", () => {
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

  it("returns all surf spots", async () => {
    mockedGetAllSpots.mockResolvedValue(surfSpots);

    const response = await app.inject({
      method: "GET",
      url: "/api/spots",
    });

    expect(response.statusCode).toBe(200);

    expect(mockedGetAllSpots).toHaveBeenCalledOnce();

    expect(response.json()).toEqual(surfSpots);
  });
});
