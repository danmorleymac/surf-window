import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { OutlookRecommendation } from "@surf-window/contracts";

import { usePreferences } from "../context/use-preferences";
import { formatForecastDate } from "../lib/date";
import { formatHeight } from "../lib/units";

type OutlookCardProps = {
  recommendation: OutlookRecommendation;
};

export function OutlookCard({ recommendation }: OutlookCardProps) {
  const { heightUnit } = usePreferences();

  return (
    <Card withBorder radius="md" padding="md">
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={4}>{recommendation.spot.name}</Title>
          <Badge>{recommendation.surfRating}</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {recommendation.spot.region} · {formatForecastDate(recommendation.date)}
        </Text>

        <Group gap="lg">
          <Text>Score {recommendation.surfScore}</Text>
          <Text>{formatHeight(recommendation.waveHeight, heightUnit)}</Text>
          <Text>{recommendation.swellPeriod?.toFixed(0)}s</Text>
        </Group>

        <Text size="sm">Best around {recommendation.bestTime.slice(11, 16)}</Text>

        <Text size="sm">Wind: {recommendation.windCondition ?? "Unknown"}</Text>
      </Stack>
    </Card>
  );
}
