/* eslint-disable react-refresh/only-export-components */
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Forecast</Link>
        {" | "}
        <Link to="/settings">Settings</Link>
      </nav>

      <Outlet />
    </>
  );
}
