import { z } from "zod";

export const SurfRatingSchema = z.enum(["poor", "fair", "good", "excellent"]);

export type SurfRating = z.infer<typeof SurfRatingSchema>;

export const WindConditionSchema = z.enum([
  "onshore",
  "cross-onshore",
  "cross-shore",
  "cross-offshore",
  "offshore",
]);

export type WindCondition = z.infer<typeof WindConditionSchema>;
