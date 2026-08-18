import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { favourites } from "../schema.js";

export async function getFavourites() {
  return db
    .select({
      spotId: favourites.spotId,
    })
    .from(favourites);
}

export async function addFavourite(spotId: string): Promise<void> {
  await db.insert(favourites).values({ spotId }).onConflictDoNothing();
}

export async function removeFavourite(spotId: string): Promise<void> {
  await db.delete(favourites).where(eq(favourites.spotId, spotId));
}
