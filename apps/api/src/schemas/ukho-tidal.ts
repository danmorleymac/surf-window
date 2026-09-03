import { z } from "zod";

const TidalEventSchema = z.object({
  EventType: z.enum(["HighWater", "LowWater"]),
  DateTime: z.string().optional(),
  Height: z.number().optional(),
  IsApproximateTime: z.boolean(),
  IsApproximateHeight: z.boolean(),
  Filtered: z.boolean(),
});

export const TidalEventsResponseSchema = z.array(TidalEventSchema);
