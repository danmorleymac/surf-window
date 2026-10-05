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
    id: "joss-bay",
    name: "Joss Bay",
    latitude: 51.38,
    longitude: 1.45,
    shoreBearing: 70,
    tidalStationId: "0102A",
  },
  {
    id: "brighton",
    name: "Brighton",
    latitude: 50.82,
    longitude: -0.14,
    shoreBearing: 180,
    tidalStationId: "0082",
  },
  {
    id: "brighton-marina",
    name: "Brighton Marina",
    latitude: 50.81,
    longitude: -0.1,
    shoreBearing: 160,
    tidalStationId: "0082",
  },
  {
    id: "eastbourne",
    name: "Eastbourne",
    latitude: 50.76,
    longitude: 0.29,
    shoreBearing: 160,
    tidalStationId: "0084",
  },
  {
    id: "east-wittering",
    name: "East Wittering",
    latitude: 50.77,
    longitude: -0.87,
    shoreBearing: 190,
    tidalStationId: "0069",
  },
  {
    id: "bracklesham",
    name: "Bracklesham Bay",
    latitude: 50.76,
    longitude: -0.85,
    shoreBearing: 190,
    tidalStationId: "0069",
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
    id: "bournemouth-pier",
    name: "Bournemouth Pier",
    latitude: 50.72,
    longitude: -1.88,
    shoreBearing: 170,
    tidalStationId: "0037",
  },
  {
    id: "boscombe",
    name: "Boscombe",
    latitude: 50.72,
    longitude: -1.84,
    shoreBearing: 170,
    tidalStationId: "0037",
  },
  {
    id: "southbourne",
    name: "Southbourne",
    latitude: 50.72,
    longitude: -1.8,
    shoreBearing: 170,
    tidalStationId: "0037",
  },
  {
    id: "kimmeridge",
    name: "Kimmeridge",
    latitude: 50.62,
    longitude: -2.12,
    shoreBearing: 200,
    tidalStationId: "0035",
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
