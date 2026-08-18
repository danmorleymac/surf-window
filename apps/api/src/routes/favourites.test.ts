import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildApp } from "../app.js";
import { addFavourite, getFavourites, removeFavourite } from "../db/queries/favourites.js";
import { getSpotById } from "../db/queries/spots.js";
import { croydeSpot } from "../test/fixtures/spots.js";
import { favouriteSpots } from "../test/fixtures/favourites.js";

vi.mock("../db/queries/favourites.js", () => ({
  getFavourites: vi.fn(),
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}));

vi.mock("../db/queries/spots.js", () => ({
  getSpotById: vi.fn(),
  getAllSpots: vi.fn(),
}));

const mockedGetFavourites = vi.mocked(getFavourites);
const mockedAddFavourite = vi.mocked(addFavourite);
const mockedRemoveFavourite = vi.mocked(removeFavourite);
const mockedGetSpotById = vi.mocked(getSpotById);

describe("Favourites routes", () => {
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

  it("returns favourite spot IDs", async () => {
    mockedGetFavourites.mockResolvedValue(favouriteSpots);

    const response = await app.inject({
      method: "GET",
      url: "/api/favourites",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(favouriteSpots);
    expect(mockedGetFavourites).toHaveBeenCalledOnce();
  });

  it("adds a favourite surf spot", async () => {
    mockedGetSpotById.mockResolvedValue(croydeSpot);
    mockedAddFavourite.mockResolvedValue(undefined);

    const response = await app.inject({
      method: "POST",
      url: "/api/favourites",
      payload: {
        spotId: "croyde",
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toEqual({
      spotId: "croyde",
    });

    expect(mockedGetSpotById).toHaveBeenCalledWith("croyde");
    expect(mockedAddFavourite).toHaveBeenCalledWith("croyde");
  });

  it("returns 404 when adding an unknown surf spot", async () => {
    mockedGetSpotById.mockResolvedValue(undefined);

    const response = await app.inject({
      method: "POST",
      url: "/api/favourites",
      payload: {
        spotId: "unknown",
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: "Unknown surf spot: unknown",
    });

    expect(mockedGetSpotById).toHaveBeenCalledWith("unknown");
    expect(mockedAddFavourite).not.toHaveBeenCalled();
  });

  it("removes a favourite surf spot", async () => {
    mockedRemoveFavourite.mockResolvedValue(undefined);

    const response = await app.inject({
      method: "DELETE",
      url: "/api/favourites/croyde",
    });

    expect(response.statusCode).toBe(204);

    expect(mockedRemoveFavourite).toHaveBeenCalledWith("croyde");
  });
});
