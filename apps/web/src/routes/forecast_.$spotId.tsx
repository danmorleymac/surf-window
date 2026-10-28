import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forecast_/$spotId")({
  component: SpotForecastPage,
});

function SpotForecastPage() {
  const { spotId } = Route.useParams();

  return <div>Forecast for {spotId}</div>;
}
