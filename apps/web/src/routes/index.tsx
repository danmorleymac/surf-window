import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Alert, Container, Loader, SimpleGrid, Stack, Title } from "@mantine/core";

import { outlookQueryOptions } from "../query-options/outlook";
import { OutlookCard } from "../components/outlook-card";
import { formatForecastDate } from "../lib/date";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const outlookQuery = useQuery(outlookQueryOptions);

  if (outlookQuery.isLoading) {
    return <Loader />;
  }

  if (outlookQuery.isError || !outlookQuery.data) {
    return <Alert title="Unable to load surf outlook">Please try again later.</Alert>;
  }

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={2}>This weekend</Title>

          <Stack gap="lg">
            {outlookQuery.data.weekend.map((day) => (
              <Stack key={day.date} gap="sm">
                <Title order={3}>{formatForecastDate(day.date)}</Title>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  {day.recommendations.map((recommendation) => (
                    <OutlookCard key={recommendation.spot.id} recommendation={recommendation} />
                  ))}
                </SimpleGrid>
              </Stack>
            ))}
          </Stack>
        </div>

        <div>
          <Title order={2}>Best of the week</Title>

          <Stack gap="lg">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {outlookQuery.data.bestOfWeek.map((recommendation) => (
                <OutlookCard
                  key={`${recommendation.spot.id}-${recommendation.date}`}
                  recommendation={recommendation}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}
