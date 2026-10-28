import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Alert, Container, Loader } from "@mantine/core";

import { outlookQueryOptions } from "../query-options/outlook";

import { OutlookTable } from "../components/outlook-table";

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
      <OutlookTable days={outlookQuery.data.days} />
    </Container>
  );
}
