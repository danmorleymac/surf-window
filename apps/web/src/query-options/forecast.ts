import { queryOptions } from "@tanstack/react-query";

import { getCroydeForecast } from "../lib/api-client";

export const croydeForecastQueryOptions = queryOptions({
  queryKey: ["forecast", "croyde"],
  queryFn: getCroydeForecast,
});