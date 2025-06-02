import { Outlet } from "@remix-run/react";

/**
 * Dashboard route nested under the app layout with sidebar
 */
export default function Dashboard() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
