/* eslint-disable react-refresh/only-export-components */

import { SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { usePreferences } from "../context/use-preferences";
import type { HeightUnit, WindSpeedUnit } from "../types/units";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { heightUnit, setHeightUnit } = usePreferences();
  const { windSpeedUnit, setWindSpeedUnit } = usePreferences();

  return (
    <Stack>
      <Title order={2}>Settings</Title>

      <div>
        <Text mb="xs">Wave height units</Text>

        <SegmentedControl
          value={heightUnit}
          onChange={(value) => setHeightUnit(value as HeightUnit)}
          data={[
            { label: "Metres", value: "m" },
            { label: "Feet", value: "ft" },
          ]}
        />

        <Text mb="xs">Wind speed units</Text>

        <SegmentedControl
          value={windSpeedUnit}
          onChange={(value) => setWindSpeedUnit(value as WindSpeedUnit)}
          data={[
            { label: "km/h", value: "km/h" },
            { label: "mph", value: "mph" },
          ]}
        />
      </div>
    </Stack>
  );
}
