import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { surfSpots, type SurfSpot } from "../schema.js";

export async function getSpotById(
  id: string,
): Promise<SurfSpot | undefined> {
  const [spot] = await db
    .select()
    .from(surfSpots)
    .where(eq(surfSpots.id, id))
    .limit(1);

  return spot;
}