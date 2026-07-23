export type ForecastHour = {
  time: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  swellDirection: number | null;
};

export type SurfForecastResponse = {
  spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  forecast: ForecastHour[];
};
