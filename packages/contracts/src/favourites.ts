import { z } from "zod";

export const FavouriteSchema = z.object({
  spotId: z.string(),
});
export const AddFavouriteBodySchema = z.object({
  spotId: z.string(),
});

export const FavouriteResponseSchema = z.object({
  spotId: z.string(),
});

export const FavouritesResponseSchema = z.array(FavouriteResponseSchema);

export const FavouriteParamsSchema = z.object({
  spotId: z.string(),
});

export const FavouriteErrorSchema = z.object({
  error: z.string(),
});

export type Favourite = z.infer<typeof FavouriteSchema>;
