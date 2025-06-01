import { Outlet } from "@remix-run/react";
import Layout from "~/components/Layout";

export default function ReportsLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
