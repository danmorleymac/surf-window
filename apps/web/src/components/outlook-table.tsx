import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import type { OutlookDay } from "@surf-window/contracts";
import { Link } from "@tanstack/react-router";

import { usePreferences } from "../context/use-preferences";
import { formatHeight } from "../lib/units";

type OutlookTableProps = {
  days: OutlookDay[];
};

function formatDayLabel(date: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
  });
}

export function OutlookTable({ days }: OutlookTableProps) {
  const { heightUnit } = usePreferences();

  return (
    <Stack gap={0}>
      {days.map((day, dayIndex) => (
        <Box
          key={day.date}
          py="md"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          {day.recommendations.map((recommendation, recommendationIndex) => (
            <Box
              key={recommendation.spot.id}
              display="grid"
              style={{
                gridTemplateColumns: "140px 1fr 100px 160px 110px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 0",
              }}
            >
              <Text fw={600}>
                {recommendationIndex === 0 ? formatDayLabel(day.date, dayIndex) : ""}
              </Text>

              <Link
                to="/forecast/$spotId"
                params={{ spotId: recommendation.spot.id }}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Text fw={500}>{recommendation.spot.name}</Text>
              </Link>

              <Text>{formatHeight(recommendation.waveHeight, heightUnit)}</Text>

              <Text tt="capitalize">{recommendation.windCondition ?? "Unknown"}</Text>

              <Group gap="xs">
                <Badge variant="light">{recommendation.surfRating}</Badge>
              </Group>
            </Box>
          ))}
        </Box>
      ))}
    </Stack>
  );
}
