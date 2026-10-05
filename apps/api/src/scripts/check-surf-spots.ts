import { fetchMarineForecast } from "../clients/open-meteo-marine-client.js";

const spots = [
  { id: "joss-bay", latitude: 51.38, longitude: 1.45 },
  { id: "brighton", latitude: 50.82, longitude: -0.14 },
  { id: "brighton-marina", latitude: 50.81, longitude: -0.1 },
  { id: "eastbourne", latitude: 50.76, longitude: 0.29 },
  { id: "east-wittering", latitude: 50.77, longitude: -0.87 },
  { id: "bracklesham", latitude: 50.76, longitude: -0.85 },
  { id: "boscombe", latitude: 50.72, longitude: -1.84 },
  { id: "southbourne", latitude: 50.72, longitude: -1.8 },
  { id: "bournemouth-pier", latitude: 50.72, longitude: -1.88 },
  { id: "kimmeridge", latitude: 50.62, longitude: -2.12 },
];

async function main() {
  for (const spot of spots) {
    try {
      const data = await fetchMarineForecast(spot.latitude, spot.longitude);

      const index = data.hourly.time.findIndex((time) => {
        const hour = new Date(`${time}Z`).getUTCHours();

        return hour === 12;
      });

      if (index === -1) {
        console.log(`\n${spot.id}: no 12:00 forecast found`);
        continue;
      }

      console.log(`\n${spot.id}`);
      console.log({
        time: data.hourly.time[index],
        waveHeight: data.hourly.wave_height[index],
        wavePeriod: data.hourly.wave_period[index],
        waveDirection: data.hourly.wave_direction[index],

        swellHeight: data.hourly.swell_wave_height[index],
        swellPeriod: data.hourly.swell_wave_period[index],
        swellDirection: data.hourly.swell_wave_direction[index],

        secondarySwellHeight: data.hourly.secondary_swell_wave_height[index],
        secondarySwellPeriod: data.hourly.secondary_swell_wave_period[index],
        secondarySwellDirection: data.hourly.secondary_swell_wave_direction[index],
      });
    } catch (error) {
      console.error(`\n${spot.id}: failed`, error);
    }
  }
}

void main();
