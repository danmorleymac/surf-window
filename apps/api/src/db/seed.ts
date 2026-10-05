import { sql } from "drizzle-orm";

import { db } from "./index.js";
import { surfSpots } from "./schema.js";

const spots = [
  {
    id: "joss-bay",
    name: "Joss Bay",
    region: "Kent",
    latitude: 51.38,
    longitude: 1.45,
    shoreBearing: 70,
    tidalStationId: "0102A",
  },

  {
    id: "brighton",
    name: "Brighton",
    region: "Sussex",
    latitude: 50.82,
    longitude: -0.14,
    shoreBearing: 180,
    tidalStationId: "0082",
  },
  {
    id: "brighton-marina",
    name: "Brighton Marina",
    region: "Sussex",
    latitude: 50.81,
    longitude: -0.1,
    shoreBearing: 160,
    tidalStationId: "0082",
  },
  {
    id: "eastbourne",
    name: "Eastbourne",
    region: "Sussex",
    latitude: 50.76,
    longitude: 0.29,
    shoreBearing: 160,
    tidalStationId: "0084",
  },
  {
    id: "east-wittering",
    name: "East Wittering",
    region: "Sussex",
    latitude: 50.77,
    longitude: -0.87,
    shoreBearing: 190,
    tidalStationId: "0069",
  },
  {
    id: "bracklesham",
    name: "Bracklesham Bay",
    region: "Sussex",
    latitude: 50.76,
    longitude: -0.85,
    shoreBearing: 190,
    tidalStationId: "0069",
  },

  {
    id: "bournemouth",
    name: "Bournemouth",
    region: "Dorset",
    latitude: 50.72,
    longitude: -1.88,
    shoreBearing: 180,
    tidalStationId: "0037",
  },
  {
    id: "bournemouth-pier",
    name: "Bournemouth Pier",
    region: "Dorset",
    latitude: 50.72,
    longitude: -1.88,
    shoreBearing: 170,
    tidalStationId: "0037",
  },
  {
    id: "boscombe",
    name: "Boscombe",
    region: "Dorset",
    latitude: 50.72,
    longitude: -1.84,
    shoreBearing: 170,
    tidalStationId: "0037",
  },
  {
    id: "southbourne",
    name: "Southbourne",
    region: "Dorset",
    latitude: 50.72,
    longitude: -1.8,
    shoreBearing: 170,
    tidalStationId: "0037",
  },
  {
    id: "kimmeridge",
    name: "Kimmeridge",
    region: "Dorset",
    latitude: 50.62,
    longitude: -2.12,
    shoreBearing: 200,
    tidalStationId: "0035",
  },

  {
    id: "croyde",
    name: "Croyde",
    region: "North Devon",
    latitude: 51.13,
    longitude: -4.24,
    shoreBearing: 270,
    tidalStationId: "0536",
  },
  {
    id: "saunton",
    name: "Saunton Sands",
    region: "North Devon",
    latitude: 51.12,
    longitude: -4.22,
    shoreBearing: 270,
    tidalStationId: "0536",
  },
  {
    id: "woolacombe",
    name: "Woolacombe",
    region: "North Devon",
    latitude: 51.17,
    longitude: -4.21,
    shoreBearing: 270,
    tidalStationId: "0535",
  },

  {
    id: "cromer",
    name: "Cromer",
    region: "Norfolk",
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
        region: sql`excluded.region`,
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
