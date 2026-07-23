import { z } from "zod";
import { ForecastResponseSchema } from "../schemas/forecast";

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

export async function getCroydeForecast() {
  const response = await fetch("/api/spots/croyde/forecast");

  if (!response.ok) {
    throw new Error(`Forecast request failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  return ForecastResponseSchema.parse(data);
}
