import { db } from "./index.js";
import { surfSpots } from "./schema.js";

const spots = [
  {
    id: "croyde",
    name: "Croyde",
    latitude: 51.13,
    longitude: -4.24,
  },
  {
    id: "saunton",
    name: "Saunton Sands",
    latitude: 51.12,
    longitude: -4.22,
  },
  {
    id: "woolacombe",
    name: "Woolacombe",
    latitude: 51.17,
    longitude: -4.21,
  },
];

async function seed(): Promise<void> {
  await db
    .insert(surfSpots)
    .values(spots)
    .onConflictDoNothing();

  console.log("Surf spots seeded");
}

void seed();