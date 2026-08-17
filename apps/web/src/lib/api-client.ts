import { z } from "zod";
import { ForecastResponseSchema } from "../schemas/forecast";
import { SpotsResponseSchema, type SpotsResponse } from "../schemas/spots";

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
    throw new Error(
      `Forecast request failed with status ${response.status}`,
    );
  }

  const data: unknown = await response.json();

  return ForecastResponseSchema.parse(data);
}