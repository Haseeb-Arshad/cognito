import { Outlet } from "@remix-run/react";

/**
 * Alerts route nested under the _app layout with sidebar
 */
export default function Alerts() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite mb-6">Alerts</h1>
      <Outlet />
    </div>
  );
}
