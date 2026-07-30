export type SurfSpot = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export const spots = {
  croyde: {
    id: "croyde",
    name: "Croyde",
    latitude: 51.13,
    longitude: -4.24,
  },
  saunton: {
    id: "saunton",
    name: "Saunton Sands",
    latitude: 51.12,
    longitude: -4.22,
  },
  woolacombe: {
    id: "woolacombe",
    name: "Woolacombe",
    latitude: 51.17,
    longitude: -4.21,
  },
} satisfies Record<string, SurfSpot>;

export type SpotId = keyof typeof spots;

export function getSpotById(id: string): SurfSpot | undefined {
  return spots[id as SpotId];
}