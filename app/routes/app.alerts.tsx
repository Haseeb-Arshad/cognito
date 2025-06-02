import { Outlet } from "@remix-run/react";

/**
 * Alerts route nested under the app layout with sidebar
 */
export default function Alerts() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
