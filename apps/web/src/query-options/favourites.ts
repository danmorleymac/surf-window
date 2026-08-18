import { queryOptions } from "@tanstack/react-query";

import { getFavourites } from "../lib/api-client";

export function favouritesQueryOptions() {
  return queryOptions({
    queryKey: ["favourites"],
    queryFn: getFavourites,
  });
}
