import { queryOptions } from "@tanstack/react-query";
import { OutlookResponseSchema, type OutlookResponse } from "@surf-window/contracts";

export const outlookQueryOptions = queryOptions({
  queryKey: ["outlook"],
  queryFn: async (): Promise<OutlookResponse> => {
    const response = await fetch("/api/outlook");

    if (!response.ok) {
      throw new Error("Unable to load surf outlook");
    }

    const data = await response.json();

    return OutlookResponseSchema.parse(data);
  },
});
