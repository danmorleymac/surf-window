import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Forecast } from "./components/forecast";
import { spotsQueryOptions } from "./query-options/spots";
import { favouritesQueryOptions } from "./query-options/favourites";
import { addFavourite, removeFavourite } from "./lib/api-client";

function App() {
  const [selectedSpotId, setSelectedSpotId] = useState("croyde");

  const { data: spots, isPending, error } = useQuery(spotsQueryOptions());
  const { data: favourites } = useQuery(favouritesQueryOptions());

  const queryClient = useQueryClient();

  const addFavouriteMutation = useMutation({
    mutationFn: addFavourite,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["favourites"],
      });
    },
  });

  const removeFavouriteMutation = useMutation({
    mutationFn: removeFavourite,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["favourites"],
      });
    },
  });
  const isFavourite = favourites?.some((favourite) => favourite.spotId === selectedSpotId);

  if (isPending) {
    return <p>Loading spots...</p>;
  }

  if (error) {
    return <p>Unable to load surf spots.</p>;
  }

  return (
    <main>
      <h1>Surf Window</h1>

      <label htmlFor="spot">Surf spot</label>

      <select
        id="spot"
        value={selectedSpotId}
        onChange={(event) => {
          setSelectedSpotId(event.target.value);
        }}
      >
        {spots.map((spot) => (
          <option key={spot.id} value={spot.id}>
            {spot.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          if (isFavourite) {
            removeFavouriteMutation.mutate(selectedSpotId);
          } else {
            addFavouriteMutation.mutate(selectedSpotId);
          }
        }}
      >
        {isFavourite ? "★ Favourite" : "☆ Favourite"}
      </button>

      <Forecast spotId={selectedSpotId} />
    </main>
  );
}

export default App;
