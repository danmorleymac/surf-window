import { useState } from "react";

import { Forecast } from "./components/forecast";
import { spots, type SpotId } from "./data/spots";

function App() {
  const [selectedSpotId, setSelectedSpotId] =
    useState<SpotId>("croyde");

  return (
    <main>
      <h1>Surf Window</h1>

      <label htmlFor="spot">Surf spot</label>

      <select
        id="spot"
        value={selectedSpotId}
        onChange={(event) => {
          setSelectedSpotId(event.target.value as SpotId);
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