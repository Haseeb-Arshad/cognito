import { Outlet } from "@remix-run/react";

/**
 * Monitoring route nested under the _app layout with sidebar
 */
export default function Monitoring() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite mb-6">Monitoring</h1>
      <Outlet />
    </div>
  );
}
