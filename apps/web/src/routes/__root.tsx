/* eslint-disable react-refresh/only-export-components */
import { Title } from "@mantine/core";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> {" | "}
        <Link to="/forecast">Forecast</Link>
        {" | "}
        <Link to="/settings">Settings</Link>
      </nav>

      <Title>Surf Window</Title>
      <Outlet />
    </>
  );
}
