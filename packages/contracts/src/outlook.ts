import { z } from "zod";

import { SurfRatingSchema, WindConditionSchema } from "./enums.js";
import { SpotSchema } from "./spots.js";

export const OutlookRecommendationSchema = z.object({
  spot: SpotSchema,
  date: z.string(),
  bestTime: z.string(),
  surfScore: z.number(),
  surfRating: SurfRatingSchema,
  waveHeight: z.number().nullable(),
  swellPeriod: z.number().nullable(),
  windCondition: WindConditionSchema.nullable(),
});

export const OutlookDaySchema = z.object({
  date: z.string(),
  recommendations: z.array(OutlookRecommendationSchema),
});

export const OutlookResponseSchema = z.object({
  weekend: z.array(OutlookDaySchema),
  bestOfWeek: z.array(OutlookRecommendationSchema),
});

export type OutlookRecommendation = z.infer<typeof OutlookRecommendationSchema>;

export type OutlookDay = z.infer<typeof OutlookDaySchema>;

export type OutlookResponse = z.infer<typeof OutlookResponseSchema>;
