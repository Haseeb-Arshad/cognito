import { Outlet } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";

export default function AlertsLayout() {
  return (
    <AppLayout title="Alerts">
      <Outlet />
    </AppLayout>
  );
}
