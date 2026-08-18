import { z } from "zod";

export const SpotSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const SpotsResponseSchema = z.array(SpotSchema);

export type Spot = z.infer<typeof SpotSchema>;
export type SpotsResponse = z.infer<typeof SpotsResponseSchema>;
