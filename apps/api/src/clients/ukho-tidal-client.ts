import { TidalEventsResponseSchema } from "../schemas/ukho-tidal.js";

const UKHO_TIDAL_API_URL = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1";

export async function getTidalEvents(stationId: string) {
  const apiKey = process.env.UKHO_TIDAL_API_KEY;

  if (!apiKey) {
    throw new Error("UKHO_TIDAL_API_KEY is not configured");
  }

  const response = await fetch(
    `${UKHO_TIDAL_API_URL}/Stations/${stationId}/TidalEvents?duration=7`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`UKHO Tidal API request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  return TidalEventsResponseSchema.parse(data);
}
