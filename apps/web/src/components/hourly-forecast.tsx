import type { ForecastHour } from "@surf-window/contracts";
import { useTable, type ColumnDef } from "@tanstack/react-table";

import { features } from "./table-features";
import { DataTable } from "./data-table";

interface HourlyForecastProps {
  forecast: ForecastHour[];
}

const columns: ColumnDef<typeof features, ForecastHour>[] = [
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) =>
      new Date(row.original.time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "waveHeight",
    header: "Waves",
    cell: ({ row }) => {
      const { waveHeight } = row.original;

      return waveHeight === null ? "—" : `${waveHeight.toFixed(1)} m`;
    },
  },
  {
    id: "primarySwell",
    header: "Primary swell",
    cell: ({ row }) => {
      const { swellHeight, swellPeriod, swellDirection } = row.original;

      if (swellHeight === null || swellPeriod === null || swellDirection === null) {
        return "—";
      }

      return `${swellHeight.toFixed(1)} m @ ${swellPeriod.toFixed(1)} s · ${swellDirection}°`;
    },
  },
  {
    id: "secondarySwell",
    header: "Secondary swell",
    cell: ({ row }) => {
      const { secondarySwellHeight, secondarySwellPeriod, secondarySwellDirection } = row.original;

      if (
        secondarySwellHeight === null ||
        secondarySwellPeriod === null ||
        secondarySwellDirection === null
      ) {
        return "—";
      }

      return `${secondarySwellHeight.toFixed(1)} m @ ${secondarySwellPeriod.toFixed(1)} s · ${secondarySwellDirection}°`;
    },
  },
  {
    id: "wind",
    header: "Wind",
    cell: ({ row }) => {
      const { windSpeedKmh, windDirection } = row.original;

      if (windSpeedKmh === null || windDirection === null) {
        return "—";
      }

      return `${windSpeedKmh.toFixed(0)} km/h · ${windDirection}°`;
    },
  },
  {
    accessorKey: "windCondition",
    header: "Condition",
    cell: ({ row }) => row.original.windCondition ?? "—",
  },
];

export function HourlyForecast({ forecast }: HourlyForecastProps) {
  const table = useTable({
    data: forecast,
    columns,
    features,
  });

  if (forecast.length === 0) {
    return <p>No more forecast data for today.</p>;
  }

  return (
    <section>
      <h3>Rest of today</h3>
      <DataTable table={table}></DataTable>
    </section>
  );
}
