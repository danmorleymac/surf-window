import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { addFavourite, getFavourites, removeFavourite } from "../db/queries/favourites.js";
import { getSpotById } from "../db/queries/spots.js";
import {
  AddFavouriteBodySchema,
  FavouriteErrorSchema,
  FavouriteParamsSchema,
  FavouriteResponseSchema,
  FavouritesResponseSchema,
} from "../schemas/favourites.js";
import { toFastifySchema } from "../schemas/to-fastify-schema.js";
export function registerFavouriteRoutes(app: FastifyInstance): void {
  app.get(
    "/api/favourites",
    {
      schema: {
        tags: ["Favourites"],
        summary: "Get favourite surf spots",
        response: {
          200: toFastifySchema(FavouritesResponseSchema),
        },
      },
    },
    async () => {
      return getFavourites();
    }
  );
  app.post<{
    Body: z.infer<typeof AddFavouriteBodySchema>;
  }>(
    "/api/favourites",
    {
      schema: {
        tags: ["Favourites"],
        summary: "Add a favourite surf spot",
        body: toFastifySchema(AddFavouriteBodySchema),
        response: {
          201: toFastifySchema(FavouriteResponseSchema),
          404: toFastifySchema(FavouriteErrorSchema),
        },
      },
    },
    async (request, reply) => {
      const { spotId } = request.body;

      const spot = await getSpotById(spotId);

      if (!spot) {
        return reply.status(404).send({
          error: `Unknown surf spot: ${spotId}`,
        });
      }

      await addFavourite(spotId);

      return reply.status(201).send({
        spotId,
      });
    }
  );
  app.delete<{
    Params: z.infer<typeof FavouriteParamsSchema>;
  }>(
    "/api/favourites/:spotId",
    {
      schema: {
        tags: ["Favourites"],
        summary: "Remove a favourite surf spot",
        params: toFastifySchema(FavouriteParamsSchema),
      },
    },
    async (request, reply) => {
      const { spotId } = request.params;

      await removeFavourite(spotId);

      return reply.status(204).send();
    }
  );
}
