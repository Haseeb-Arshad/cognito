import { Outlet } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";

export default function MonitoringLayout() {
  return (
    <AppLayout title="Monitoring">
      <Outlet />
    </AppLayout>
  );
}
