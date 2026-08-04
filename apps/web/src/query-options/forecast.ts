import { queryOptions } from "@tanstack/react-query";

import { getSpotForecast } from "../lib/api-client";

export function forecastQueryOptions(spotId: string) {
  return queryOptions({
    queryKey: ["forecast", spotId],
    queryFn: () => getSpotForecast(spotId),
  });
}