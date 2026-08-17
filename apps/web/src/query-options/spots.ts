import { queryOptions } from "@tanstack/react-query";

import { getSpots } from "../lib/api-client";

export function spotsQueryOptions() {
  return queryOptions({
    queryKey: ["spots"],
    queryFn: getSpots,
  });
}