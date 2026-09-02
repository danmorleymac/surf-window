import { sql } from "drizzle-orm";

import { db } from "./index.js";
import { surfSpots } from "./schema.js";

const spots = [
  {
    id: "bournemouth",
    name: "Bournemouth",
    latitude: 50.7164,
    longitude: -1.8747,
    shoreBearing: 180,
  },
  {
    id: "cromer",
    name: "Cromer",
    latitude: 52.94,
    longitude: 1.28,
    shoreBearing: 25,
  },
  {
    id: "croyde",
    name: "Croyde",
    latitude: 51.13,
    longitude: -4.24,
    shoreBearing: 270,
  },
  {
    id: "saunton",
    name: "Saunton Sands",
    latitude: 51.12,
    longitude: -4.22,
    shoreBearing: 270,
  },
  {
    id: "woolacombe",
    name: "Woolacombe",
    latitude: 51.17,
    longitude: -4.21,
    shoreBearing: 270,
  },
];

// Updates existing spots and still inserts any missing ones.
async function seed(): Promise<void> {
  await db
    .insert(surfSpots)
    .values(spots)
    .onConflictDoUpdate({
      target: surfSpots.id,
      set: {
        name: sql`excluded.name`,
        latitude: sql`excluded.latitude`,
        longitude: sql`excluded.longitude`,
        shoreBearing: sql`excluded.shore_bearing`,
      },
    });

  console.log("Surf spots seeded");
}

void seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
