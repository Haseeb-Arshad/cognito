import { Outlet } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";

export default function SettingsLayout() {
  return (
    <AppLayout title="Settings">
      <Outlet />
    </AppLayout>
  );
}
