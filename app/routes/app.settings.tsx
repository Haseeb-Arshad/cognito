import { Outlet } from "@remix-run/react";

/**
 * Settings route nested under the app layout with sidebar
 */
export default function Settings() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
