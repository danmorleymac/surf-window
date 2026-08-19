import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addFavourite, removeFavourite } from "../lib/api-client";
import { favouritesQueryOptions } from "../query-options/favourites";

export function useFavourites(spotId: string) {
  const queryClient = useQueryClient();

  const {
    data: favourites,
    isPending: isLoading,
    error: loadError,
  } = useQuery(favouritesQueryOptions());

  const invalidateFavourites = () =>
    queryClient.invalidateQueries({
      queryKey: ["favourites"],
    });

  const addMutation = useMutation({
    mutationFn: addFavourite,
    onSuccess: invalidateFavourites,
  });

  const removeMutation = useMutation({
    mutationFn: removeFavourite,
    onSuccess: invalidateFavourites,
  });

  const isFavourite = favourites?.some((favourite) => favourite.spotId === spotId);

  return {
    isFavourite,
    addFavourite: addMutation.mutate,
    removeFavourite: removeMutation.mutate,
    isLoading,
    isPending: addMutation.isPending || removeMutation.isPending,
    error: loadError ?? addMutation.error ?? removeMutation.error,
  };
}
