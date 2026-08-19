import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Forecast } from "./components/forecast";
import { useFavourites } from "./hooks/use-favourites";
import { spotsQueryOptions } from "./query-options/spots";

function App() {
  const [selectedSpotId, setSelectedSpotId] = useState("croyde");

  const { data: spots, isPending, error } = useQuery(spotsQueryOptions());

  const {
    isFavourite,
    addFavourite,
    removeFavourite,
    isPending: isFavouritePending,
    error: favouriteError,
  } = useFavourites(selectedSpotId);

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
        disabled={isFavouritePending}
        onClick={() => {
          if (isFavourite) {
            removeFavourite(selectedSpotId);
          } else {
            addFavourite(selectedSpotId);
          }
        }}
      >
        {isFavouritePending ? "Updating..." : isFavourite ? "★ Favourite" : "☆ Favourite"}
      </button>

      {favouriteError && (
        <p>
          {favouriteError instanceof Error ? favouriteError.message : "Unable to update favourite"}
        </p>
      )}

      <Forecast spotId={selectedSpotId} />
    </main>
  );
}

export default App;
