import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Forecast } from "./components/forecast";
import { spotsQueryOptions } from "./query-options/spots";

function App() {
  const [selectedSpotId, setSelectedSpotId] = useState("croyde");

  const { data: spots, isPending, error } = useQuery(spotsQueryOptions());

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

      <Forecast spotId={selectedSpotId} />
    </main>
  );
}

export default App;
