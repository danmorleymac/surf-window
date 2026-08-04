export const spots = [
    {
      id: "croyde",
      name: "Croyde",
    },
    {
      id: "saunton",
      name: "Saunton Sands",
    },
    {
      id: "woolacombe",
      name: "Woolacombe",
    },
  ] as const;
  
  export type SpotId = (typeof spots)[number]["id"];