import { z } from "zod";

export const FavouriteSchema = z.object({
  spotId: z.string(),
});

export const FavouritesResponseSchema = z.array(FavouriteSchema);

export type Favourite = z.infer<typeof FavouriteSchema>;
