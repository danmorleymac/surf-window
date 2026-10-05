const latitude = 52.93;
const longitude = 1.3;

const allModels = [
  "best_match",
  "ecmwf_wam025",
  "ncep_gfswave025",
  "ncep_gfswave016",
  "ewam",
  "meteofrance_wave",
  "gwam",
  "ecmwf_wam",
];
const hourlyFields = [
  "wave_height",
  "wave_period",
  "wave_direction",
  "swell_wave_height",
  "swell_wave_period",
  "swell_wave_direction",
].join(",");

const targetDate = "2026-09-08";

async function main() {
  for (const model of allModels) {
    const searchParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: hourlyFields,
      timezone: "GMT",
      forecast_days: "7",
      models: model,
    });

    const url = `https://marine-api.open-meteo.com/v1/marine?${searchParams}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log(`${model}: request failed (${response.status})`);
      continue;
    }

    const data = await response.json();

    console.log(`\n${model}`);

    data.hourly.time.forEach((time: string, index: number) => {
      const hour = Number(time.slice(11, 13));

      if (time.startsWith(targetDate) && hour % 3 === 0) {
        console.log(
          `${time.slice(11)} | ` +
            `wave ${data.hourly.wave_height[index]}m @ ${data.hourly.wave_period[index]}s | ` +
            `swell ${data.hourly.swell_wave_height[index]}m @ ${data.hourly.swell_wave_period[index]}s`
        );
      }
    });
  }
}

void main();
