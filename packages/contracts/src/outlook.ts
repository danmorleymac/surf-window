import z from "zod";
import { SpotSchema } from "./spots.js";
import { SurfRatingSchema, WindConditionSchema } from "./enums.js";

export const OutlookRecommendationSchema = z.object({
  spot: SpotSchema,
  date: z.string(),
  time: z.string(),
  surfScore: z.number(),
  surfRating: SurfRatingSchema,
  waveHeight: z.number().nullable(),
  swellPeriod: z.number().nullable(),
  windCondition: WindConditionSchema.nullable(),
});

export const OutlookResponseSchema = z.object({
  weekend: z.object({
    saturday: z.array(OutlookRecommendationSchema),
    sunday: z.array(OutlookRecommendationSchema),
  }),
  bestOfWeek: z.array(OutlookRecommendationSchema),
});
