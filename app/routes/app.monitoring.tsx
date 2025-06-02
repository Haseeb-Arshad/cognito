import { Outlet } from "@remix-run/react";

/**
 * Monitoring route nested under the app layout with sidebar
 */
export default function Monitoring() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
