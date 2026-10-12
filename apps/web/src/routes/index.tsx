import { Button, Stack, Text } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <Stack>
      <Text>Find the best surf windows for a day trip from London.</Text>

      <Button component={Link} to="/forecast">
        View forecast
      </Button>
    </Stack>
  );
}
