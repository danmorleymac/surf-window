import { z } from "zod";
import { ForecastResponseSchema } from "../schemas/forecast";
import { SpotsResponseSchema, type SpotsResponse } from "../schemas/spots";
import { FavouriteSchema, FavouritesResponseSchema } from "../schemas/favourites";

const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(`Health request failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  return healthResponseSchema.parse(data);
}

export async function getSpots(): Promise<SpotsResponse> {
  const response = await fetch("/api/spots");

  if (!response.ok) {
    throw new Error(`Spots request failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  return SpotsResponseSchema.parse(data);
}

export async function getSpotForecast(spotId: string) {
  const response = await fetch(`/api/spots/${spotId}/forecast`);

  if (!response.ok) {
    throw new Error(`Forecast request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return ForecastResponseSchema.parse(data);
}

export async function getFavourites() {
  const response = await fetch("/api/favourites");

  if (!response.ok) {
    throw new Error(`Favourites request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return FavouritesResponseSchema.parse(data);
}

export async function addFavourite(spotId: string) {
  const response = await fetch("/api/favourites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spotId }),
  });

  if (!response.ok) {
    throw new Error(`Add favourite request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return FavouriteSchema.parse(data);
}

export async function removeFavourite(spotId: string) {
  const response = await fetch(`/api/favourites/${spotId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Remove favourite request failed with status ${response.status}`);
  }
}
