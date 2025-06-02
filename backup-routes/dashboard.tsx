import { Outlet } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";

/**
 * Dashboard Layout
 * Uses the common AppLayout component for consistent navigation
 */
export default function DashboardLayout() {
  return (
    <AppLayout title="Dashboard">
      <Outlet />
    </AppLayout>
  );
}
