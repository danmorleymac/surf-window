// src/test/fixtures/spots.ts

import type { SurfSpot } from "../../db/schema.js";

export const croydeSpot: SurfSpot = {
  id: "croyde",
  name: "Croyde",
  latitude: 51.13,
  longitude: -4.24,
  shoreBearing: 270,
};

export const surfSpots = [
  croydeSpot,
  {
    id: "saunton",
    name: "Saunton Sands",
    latitude: 51.12,
    longitude: -4.22,
    shoreBearing: 270,
  },
];
