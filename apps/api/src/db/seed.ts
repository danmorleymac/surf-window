import { sql } from "drizzle-orm";

import { db } from "./index.js";
import { surfSpots } from "./schema.js";

const spots = [
  {
    id: "croyde",
    name: "Croyde",
    latitude: 51.13,
    longitude: -4.24,
    shoreBearing: 270,
    tidalStationId: "0536",
  },
  {
    id: "saunton",
    name: "Saunton Sands",
    latitude: 51.12,
    longitude: -4.22,
    shoreBearing: 270,
    tidalStationId: "0536",
  },
  {
    id: "woolacombe",
    name: "Woolacombe",
    latitude: 51.17,
    longitude: -4.21,
    shoreBearing: 270,
    tidalStationId: "0535",
  },
  {
    id: "bournemouth",
    name: "Bournemouth",
    latitude: 50.72,
    longitude: -1.88,
    shoreBearing: 180,
    tidalStationId: "0037",
  },
  {
    id: "cromer",
    name: "Cromer",
    latitude: 52.93,
    longitude: 1.3,
    shoreBearing: 25,
    tidalStationId: "0154",
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
        tidalStationId: sql`excluded.tidal_station_id`,
      },
    });

  console.log("Surf spots seeded");
}

void seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
