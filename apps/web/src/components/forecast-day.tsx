import type { ForecastHour, TideEvent } from "@surf-window/contracts";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useTable, type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./data-table";
import { features } from "./table-features";
import { TideSummary } from "./tide-summary";

interface ForecastDayProps {
  forecast: ForecastHour[];
  tideEvents: TideEvent[];
  title: string;
}

const columns: ColumnDef<typeof features, ForecastHour>[] = [
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) =>
      new Date(`${row.original.time}Z`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
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

export function ForecastDay({ forecast, tideEvents, title }: ForecastDayProps) {
  const [expanded, setExpanded] = useState(false);

  const threeHourlyForecast = forecast.filter((item) => {
    const hour = new Date(`${item.time}Z`).getUTCHours();

    return hour % 3 === 0;
  });

  const summaryForecast = forecast.filter((item) => {
    const hour = new Date(`${item.time}Z`).getUTCHours();

    return [6, 12, 18].includes(hour);
  });

  const displayedForecast = expanded ? threeHourlyForecast : summaryForecast;

  const table = useTable({
    data: displayedForecast,
    columns,
    features,
  });

  return (
    <section>
      <h3>{title}</h3>
      <TideSummary events={tideEvents} />
      <DataTable table={table} />
      <Button variant="subtle" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Show less" : "Show more"}
      </Button>
    </section>
  );
}
